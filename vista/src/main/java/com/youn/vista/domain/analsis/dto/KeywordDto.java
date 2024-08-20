package com.youn.vista.domain.analsis.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KeywordDto {

    String keyword;
    Long count;
    String sentiment;
}
