package com.youn.vista.global.utility.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.youn.vista.global.menu.dto.MenuDto;
import com.youn.vista.global.menu.entity.Menu;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface GlobalMapper {

    public Menu menuDtoToMenu(MenuDto menuDto);

    @Mapping(target = "subMenu",ignore = true)
    public MenuDto menuToMenuDto(Menu menu);
}
