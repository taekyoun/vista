package com.youn.vista.domain.analsis.dto;

import java.util.Set;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class KeywordAnalsisDto {

    Set<String> originIdList;
    String keyword;
    Long count;
    String sentiment;
}
