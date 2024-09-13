package com.youn.vista.global.auth.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "web_user")
@Data
public class UserEntity {

    @Id
    private String id;

    @Column(nullable = false, columnDefinition="varchar(10)")
    private String name;
    
    @Column(nullable = false, columnDefinition="varchar(30)")
    private String password;

    @Column(nullable = false)
    private LocalDate birth;

    @Column(nullable = false)
    private String role;


}
