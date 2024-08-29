package com.youn.vista.global.menu.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youn.vista.global.menu.entity.Menu;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer>{



}
