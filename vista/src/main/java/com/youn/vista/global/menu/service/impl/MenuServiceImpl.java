package com.youn.vista.global.menu.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.youn.vista.global.menu.dto.MenuDto;
import com.youn.vista.global.menu.entity.Menu;
import com.youn.vista.global.menu.repository.MenuRepository;
import com.youn.vista.global.menu.service.MenuService;
import com.youn.vista.utility.mapper.GlobalMapper;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;
    private final GlobalMapper globalMapper;
    private final MenuHandler menuHandler; 

    @Override
    public List<MenuDto> getMenuList(String sort) {
        List<MenuDto> topMenus = new ArrayList<>();
        switch (sort) {
            case "all":
                topMenus = menuHandler.getMenuCache().stream()
                    .map(globalMapper::menuToMenuDto)
                    .filter(dto-> (dto.getUpperMenu()==null|| dto.getUpperMenu().isBlank()))
                    .sorted(Comparator.comparingInt(MenuDto::getOrder))
                    .toList();
                break;
            case "use":
                topMenus = menuHandler.getMenuCache().stream()
                .map(globalMapper::menuToMenuDto)
                .filter(MenuDto::getUsage)
                .filter(dto-> (dto.getUpperMenu()==null|| dto.getUpperMenu().isBlank()))
                .sorted(Comparator.comparingInt(MenuDto::getOrder))
                .toList();
                break;
            default:
                topMenus = menuHandler.getMenuCache().stream()
                .map(globalMapper::menuToMenuDto)
                .filter(dto-> (dto.getUpperMenu()==null|| dto.getUpperMenu().isBlank()))
                .sorted(Comparator.comparingInt(MenuDto::getOrder))
                .toList();
        }
        List<MenuDto> hierarchyMenuList = new ArrayList<>();
        topMenus.forEach(menu->{
            hierarchyMenuList.add(recursiveMenus(menu));
        });
 
        return hierarchyMenuList;
    }

    @Override
    @Transactional
    public void insertMenu(MenuDto menuDto) {
        System.out.println(menuDto);
        menuRepository.save(globalMapper.menuDtoToMenu(menuDto));
        menuHandler.refreshMenuData();
    }

    @Override
    @Transactional
    public void updateMenu(MenuDto menuDto) {
        Menu menu =menuRepository.findById(globalMapper.menuDtoToMenu(menuDto).getId()).orElseThrow(()->new EntityNotFoundException());
        menu.setName(menuDto.getName());
        menu.setComment(menuDto.getComment());
        menu.setPath(menuDto.getPath());
        menu.setUpperMenu(menuDto.getUpperMenu());
        menu.setUsage(menuDto.getUsage());
        menu.setOrder(menuDto.getOrder());
        menuRepository.save(menu);
        menuHandler.refreshMenuData();
    }

    @Override
    @Transactional
    public void deleteMenu(Integer id) {
        menuRepository.deleteById(id);
        menuHandler.refreshMenuData();
    }

    private MenuDto recursiveMenus(MenuDto menuDto){
        List<MenuDto> subMenus = menuHandler.getMenuCache().stream()
            .map(globalMapper::menuToMenuDto)
            .filter(dto->(dto.getUpperMenu()!=null && !dto.getUpperMenu().isBlank()))
            .filter(dto->dto.getUpperMenu().equals(menuDto.getName()))
            .sorted(Comparator.comparingInt(MenuDto::getOrder))
            .toList();
        if(subMenus.size()>0){
            List<MenuDto> subMenuDtos = new ArrayList<>();
            subMenus.forEach(menu->{
                subMenuDtos.add(recursiveMenus(menu));
            });
            menuDto.setSubMenu(subMenuDtos);
            return menuDto;
        }
        else{
            menuDto.setSubMenu(null);
            return menuDto;
        }

    }

  

}
