package com.youn.vista.domain.analsis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youn.vista.domain.analsis.entity.WordSentiment;

@Repository
public interface WordSentimentRepository extends JpaRepository<WordSentiment , String>{
    

}
