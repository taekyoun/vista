package com.youn.vista.global.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youn.vista.global.auth.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,String>{

}
