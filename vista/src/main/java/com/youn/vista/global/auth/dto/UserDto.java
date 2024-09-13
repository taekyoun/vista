package com.youn.vista.global.auth.dto;

import java.time.LocalDate;

import lombok.Data;


@Data
public class UserDto {
    private String id;
    private String name;
    private String password;
    private LocalDate birth;
    private String role;
}
