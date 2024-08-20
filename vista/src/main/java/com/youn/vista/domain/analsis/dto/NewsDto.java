package com.youn.vista.domain.analsis.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NewsDto {

    private String id;
    private String title;
    private String content;
    private String linkUrl;
    private String date;
}
