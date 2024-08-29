package com.youn.vista.global.menu.service;

import java.util.List;

import com.youn.vista.global.menu.dto.MenuDto;

public interface MenuService {

    public List<MenuDto> getMenuList(String sort);

    public void insertMenu(MenuDto menuDto);

    public void updateMenu(MenuDto menuDto);

    public void deleteMenu(MenuDto menuDto);
}
