package com.youn.vista.domain.analsis.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youn.vista.domain.analsis.dto.NewsDto;
import com.youn.vista.domain.analsis.service.KeywordAnalsisService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/keyword")
@RequiredArgsConstructor
public class KeywordAnalsisController {

    private final KeywordAnalsisService keywordAnalsisService;

    private enum SortType {
        news, info
    }

    @Data
    static class Params {

        @NotBlank
        private String keyword;

        @NotNull
        @Min(1)
        @Max(100)
        private int count;
    }
    

    @GetMapping("/{sort}")
    public ResponseEntity<Object> getContent(@PathVariable("sort") SortType sort,@Valid @ModelAttribute Params params){
        List<?> resultList = null;
        List<NewsDto> newsList =keywordAnalsisService.getNewsData(params.getKeyword(),params.getCount());
        switch (sort) {
            case news:
                resultList = newsList;
                break;
            case info:
                resultList = keywordAnalsisService.getKeywordInfo(newsList);
                break;
            default:
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body("Invalid sort parameter");
        }
       
        return ResponseEntity.ok(resultList);
    }
   
}
