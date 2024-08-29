package com.youn.vista.global.menu.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuDto {

    private Integer id;
    private String name;
    private String comment;
    private String upperMenu;
    private String path;
    private Boolean usage;
    private Integer order;
    private List<MenuDto> subMenu;
}
