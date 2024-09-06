package com.youn.vista.domain.analsis.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KeywordDto {

    String originId;
    String keyword;
    Long count;
    @Builder.Default
    String sentiment = "common";
}
