package com.youn.vista.domain.analsis.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youn.vista.domain.analsis.dto.NewsDto;
import com.youn.vista.domain.analsis.service.KeywordAnalsisService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/keyword")
@RequiredArgsConstructor
public class KeywordAnalsisController {

    private final KeywordAnalsisService keywordAnalsisService;

    @GetMapping("/{sort}")
    public ResponseEntity<Object> getContent(@PathVariable("sort") String sort){
        List<?> reulstList = null;
        switch (sort) {
            case "news":
                reulstList = keywordAnalsisService.getNewsData("윤석열",100);
                break;
            case "info":
                List<NewsDto> newsList =keywordAnalsisService.getNewsData("윤석열",100);
                reulstList = keywordAnalsisService.getKeywordInfo(newsList);
                break;
            default:
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body("null");
        }
       
        return ResponseEntity.ok(reulstList);
    }
}
