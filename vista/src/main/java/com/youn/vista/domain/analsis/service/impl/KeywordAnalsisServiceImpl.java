package com.youn.vista.domain.analsis.service.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.cache.annotation.Cacheable;
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
import com.youn.vista.domain.analsis.utility.WebCrawling;

import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.Token;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KeywordAnalsisServiceImpl implements KeywordAnalsisService{
    
    private final WordSentimentRepository wordSentimentRepository;
    private final WebCrawling<NewsDto> webCrawling;

  

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
    public List<KeywordDto> getKeywordInfo(List<NewsDto> newsList) {
        newsList.stream().map(dto->
            webCrawling.start(dto.getLinkUrl(), dto)
        ).toList();
        
        Komoran komoran = new Komoran(DEFAULT_MODEL.LIGHT);
        List<Token> allTokens = newsList.stream()
            .flatMap(newsDto -> komoran.analyze(newsDto.getContent()).getTokenList().stream())
            .filter(token -> "NNG".equals(token.getPos()))
            .collect(Collectors.toList());

        Map<String, Long> keywordCounts = allTokens.stream()
            .collect(Collectors.groupingBy(Token::getMorph, Collectors.counting()));
            
        List<KeywordDto> keywordInfoList = keywordCounts.entrySet().stream()
            .map(entry -> KeywordDto.builder()
                .keyword(entry.getKey())
                .count(entry.getValue())
                .build())
            .collect(Collectors.toList());
       
        return  runKeywordAnalsis(keywordInfoList);
    }

    @Override
    @Transactional
    public List<KeywordDto> runKeywordAnalsis(List<KeywordDto> keywordList) {
        HashMap<String,String> wordSentimentMap = new HashMap<>();
        wordSentimentRepository.findAll().forEach(wordSentiment->{
            wordSentimentMap.put(wordSentiment.getWord(), wordSentiment.getSentiment());
        });

        return keywordList.stream()
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
    }

    @Override
    public KeywordAnalsisDto getKeywordAnalsis() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getKeywordAnalsis'");
    }  

}
