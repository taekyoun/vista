package com.youn.vista.global.menu.service.impl;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.youn.vista.global.menu.entity.Menu;
import com.youn.vista.global.menu.repository.MenuRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MenuHandler {

    private final MenuRepository menuRepository;
    private List<Menu> menuCache;

    @PostConstruct
    public void init() {
        loadMenuData();
       
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void loadMenuData() {
        menuCache = menuRepository.findAll(); // 모든 메뉴를 로드
    }

    public List<Menu> getMenuCache() {
        return menuCache;
    }

    @Scheduled(fixedRate = 60000) // 60초마다 갱신
    public void refreshMenuData() {
        loadMenuData();
    }


}
