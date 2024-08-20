package com.youn.vista.domain.analsis.service;

import java.util.List;

import com.youn.vista.domain.analsis.dto.KeywordAnalsisDto;
import com.youn.vista.domain.analsis.dto.KeywordDto;
import com.youn.vista.domain.analsis.dto.NewsDto;

public interface KeywordAnalsisService {

    public List<NewsDto> getNewsData(String keyword, int count);

    public List<KeywordDto> getKeywordInfo(List<NewsDto> newsList);

    public void runKeywordAnalsis(List<KeywordDto> keywordList);

    public KeywordAnalsisDto getKeywordAnalsis();

}
