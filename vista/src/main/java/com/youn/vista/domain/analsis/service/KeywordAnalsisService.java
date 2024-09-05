package com.youn.vista.domain.analsis.service;

import java.util.List;

import com.youn.vista.domain.analsis.dto.KeywordAnalsisDto;
import com.youn.vista.domain.analsis.dto.KeywordDto;
import com.youn.vista.domain.analsis.dto.NewsDto;

public interface KeywordAnalsisService {

    public List<NewsDto> getNewsData(String keyword, int count);

    public List<KeywordDto> getKeywordInfo(String linkUrl,String description);

    public List<KeywordDto> getKeywordInfoList(List<NewsDto> newsList);

    public KeywordAnalsisDto getKeywordAnalsis();

    

}
