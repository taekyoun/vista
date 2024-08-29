package com.youn.vista.global.menu.entity;

import com.youn.vista.global.menu.service.impl.MenuEventListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "menu")
@Data
@EntityListeners(MenuEventListener.class)
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, columnDefinition="varchar(20)")
    private String name;

    @Column(length = 100)
    private String comment;

    @Column(name = "upper_menu", columnDefinition = "varchar(20)")
    private String upperMenu;

    @Column(unique = true, nullable = false, columnDefinition="varchar(50)")
    private String path;

    @Column(nullable = false)
    private Boolean usage;

    @Column(name="menu_order", columnDefinition ="int")
    private Integer order;



}
