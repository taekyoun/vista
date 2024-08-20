package com.youn.vista.domain.analsis.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "word_sentiment")
@Data
public class WordSentiment {

    @Id
    private String word;

    @Column
    private String sentiment;

}
