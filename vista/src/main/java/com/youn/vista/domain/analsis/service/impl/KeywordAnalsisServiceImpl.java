package com.youn.vista.domain.analsis.service.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.youn.vista.domain.analsis.dto.KeywordAnalsisDto;
import com.youn.vista.domain.analsis.dto.KeywordDto;
import com.youn.vista.domain.analsis.dto.NewsDto;
import com.youn.vista.domain.analsis.repository.WordSentimentRepository;
import com.youn.vista.domain.analsis.service.KeywordAnalsisService;
import com.youn.vista.domain.analsis.utility.KeywordAnalyzer;
import com.youn.vista.domain.analsis.utility.WebCrawling;

import kr.co.shineware.nlp.komoran.model.Token;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KeywordAnalsisServiceImpl implements KeywordAnalsisService{
    
    private final WordSentimentRepository wordSentimentRepository;
    private final WebCrawling<NewsDto> webCrawling;
    private final KeywordAnalyzer keywordAnalyzer;

  

    @Override
    @Cacheable("newsData")
    public List<NewsDto> getNewsData(String keyword, int count) {
        final String CLIENT_ID = "OgdTH1QY4Kc60YKWbcT8"; 
        final String CLIENT_SECRET = "kiw0iy5mYN"; 
        List<NewsDto> newList = new ArrayList<>();
        String text = null;

         try {
            text = URLEncoder.encode(keyword, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("검색어 인코딩 실패",e);
        }

        String apiUrl ="https://openapi.naver.com/v1/search/news.json?sort=date&start=1&query=" + text + "&display="+count;
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet request = new HttpGet(apiUrl);
        request.addHeader("X-Naver-Client-Id", CLIENT_ID);
        request.addHeader("X-Naver-Client-Secret", CLIENT_SECRET);

        try (CloseableHttpResponse response = client.execute(request)) {
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                String result = EntityUtils.toString(entity);
                JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();
                JsonArray items = jsonObject.getAsJsonArray("items");

                for (int i = 0; i < items.size(); i++) {
                    JsonObject item = items.get(i).getAsJsonObject();
                    String title = item.get("title").getAsString();
                    String link = item.get("link").getAsString();
                    String description = item.get("description").getAsString();
                    String pubDate = item.get("pubDate").getAsString();

                    newList.add(NewsDto.builder()
                                    .title(title)
                                    .description(description)
                                    .linkUrl(link)
                                    .date(pubDate)
                                    .id(""+i)
                                    .build());
                }
            }
        }
        catch(IOException e){
            System.out.println("Error" + e);
        }
        return newList;
    }

    @Override
    @Cacheable("keywordData")
    @Transactional
    public List<KeywordDto> getKeywordInfo(List<NewsDto> newsList) {
        HashMap<String,String> wordSentimentMap = new HashMap<>();
        wordSentimentRepository.findAll().forEach(wordSentiment->{
            wordSentimentMap.put(wordSentiment.getWord(), wordSentiment.getSentiment());
        });

        List<KeywordDto> keywordList = newsList.stream()
            .map(dto->webCrawling.start(dto.getLinkUrl(), dto))
            .flatMap(newsDto-> keywordAnalyzer.analyze(newsDto.getContent())
                .entrySet().stream()
                .map(entry -> KeywordDto.builder()
                    .originId(newsDto.getId())
                    .keyword(entry.getKey())
                    .count(entry.getValue())
                    .build())
            )
            .map(keywordDto -> {
                String sentimentCode = wordSentimentMap.getOrDefault(keywordDto.getKeyword(), "keyword");
                switch (sentimentCode) {
                    case "DIC02":
                        keywordDto.setSentiment("긍정");
                        break;
                    case "DIC03":
                        keywordDto.setSentiment("부정");
                        break;
                    default:
                        keywordDto.setSentiment(sentimentCode);
                        break;
                }
                return keywordDto;
            })
            .filter(dto -> !"DIC01".equals(dto.getSentiment()))
            .toList();
        
    
        return  keywordList;
    }

   

  

    @Override
    @Transactional
    @Cacheable("keywordData")
    public List<KeywordDto> processKeywordsAsync(List<NewsDto> newsList) {
        HashMap<String,String> wordSentimentMap = new HashMap<>();
        wordSentimentRepository.findAll().forEach(wordSentiment->{
            wordSentimentMap.put(wordSentiment.getWord(), wordSentiment.getSentiment());
        });
        List<CompletableFuture<List<KeywordDto>>> futures = newsList.stream()
            .map(dto -> webCrawling.crawlNews(dto.getLinkUrl(), dto) // 크롤링 비동기 호출
                .thenCompose(newsDto -> {
                    System.out.println("Crawling finished for URL: " + dto.getLinkUrl() + ", starting analysis...");
                    // 크롤링이 완료된 후에 형태소 분석을 비동기적으로 호출
                    return keywordAnalyzer.analyzeContent(newsDto.getContent())
                        .thenApply(keywordMap -> {
                            System.out.println("Combining results for ID: " + newsDto.getId());
                            return keywordMap.entrySet().stream()
                                .map(entry -> KeywordDto.builder()
                                    .originId(newsDto.getId())
                                    .keyword(entry.getKey())
                                    .count(entry.getValue())
                                    .build())
                                .collect(Collectors.toList());
                        });
                }))
            .collect(Collectors.toList());

        return futures.parallelStream()
            .flatMap(future -> {
                try {
                    return future.get().stream();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            })
            .map(keywordDto -> {
                String sentimentCode = wordSentimentMap.getOrDefault(keywordDto.getKeyword(), "keyword");
                switch (sentimentCode) {
                    case "DIC02":
                        keywordDto.setSentiment("긍정");
                        break;
                    case "DIC03":
                        keywordDto.setSentiment("부정");
                        break;
                    default:
                        keywordDto.setSentiment(sentimentCode);
                        break;
                }
                return keywordDto;
            })
            .filter(dto -> !"DIC01".equals(dto.getSentiment()))
            .collect(Collectors.toList());
    }




    @Override
    public KeywordAnalsisDto getKeywordAnalsis() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getKeywordAnalsis'");
    }  

}
