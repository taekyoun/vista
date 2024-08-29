package com.youn.vista.global.menu.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.youn.vista.global.menu.entity.Menu;

import jakarta.persistence.PostPersist;

public class MenuEventListener{

    @Lazy
    @Autowired
    private MenuHandler menuHandler;

    
    @PostPersist
    public void onPostPersistOrUpdate(Menu menu) {
        System.out.println("입력됨");
        menuHandler.loadMenuData();
    }


   
}
