package com.youn.vista.global.menu.service.impl;



import com.youn.vista.global.menu.entity.Menu;

import jakarta.persistence.PostPersist;

public class MenuEventListener{

    
    @PostPersist
    public void onPostPersistOrUpdate(Menu menu) {
        System.out.println("입력됨");
    }


   
}
