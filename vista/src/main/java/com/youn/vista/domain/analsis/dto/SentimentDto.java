package com.youn.vista.domain.analsis.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SentimentDto {

    private int keywordCnt;
    private int positiveCnt;
    private int negativeCnt;
    private int restCnt;


}
