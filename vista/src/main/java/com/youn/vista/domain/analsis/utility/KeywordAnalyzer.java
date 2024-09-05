package com.youn.vista.domain.analsis.utility;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.RejectedExecutionException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.Token;

@Component
public class KeywordAnalyzer {

    private final Komoran komoran;

    @Autowired
    public KeywordAnalyzer(){
        this.komoran=komoran();
    }

    @Bean
    public Komoran komoran(){
        return new Komoran(DEFAULT_MODEL.LIGHT);
    }

    public Komoran tool(){
        return this.komoran;
    }

    public Map<String,Long> analyze(String text){
        return this.komoran
            .analyze(text)
            .getTokenList()
            .stream()
            .filter(token -> "NNG".equals(token.getPos()))
            .collect(Collectors.groupingBy(Token::getMorph, Collectors.counting()));
            
    }

  
    @Retryable(
    value = { RejectedExecutionException.class },
    maxAttempts = 5,
    backoff = @Backoff(delay = 1000))
    @Async("taskExecutor")
    public CompletableFuture<Map<String, Long>> analyzeContent(String content) {
        Map<String, Long> keywords = analyze(content); // 형태소 분석 작업
        return CompletableFuture.completedFuture(keywords);
    }
}
