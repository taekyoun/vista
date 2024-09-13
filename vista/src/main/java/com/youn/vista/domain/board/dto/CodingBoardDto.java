package com.youn.vista.domain.board.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CodingBoardDto {

    private String title;
    private String question;
    private String content;
    private String level;
    private String writeDate;
    
}
