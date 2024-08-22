package com.youn.vista.domain.analsis.utility;

import java.io.IOException;
import java.lang.reflect.Field;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

@Component
public class WebCrawling<T> {

    public T start(String url, T dto){
        String content = fetchContent(url);
        if (content.isEmpty()) {
            content = getDescriptionContent(dto);
        }
        setField(dto, "content", content);
        return dto;
       
    }

    private String fetchContent(String url) {
        try {
            Document document = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                .get();
            Elements articleContent = document.select("body");
            
            return articleContent.text().replaceAll("[^\\uac00-\\ud7af]", " ");
            
        } catch (IOException  crawringExc) {
            System.out.println(crawringExc.getMessage());
            return "";
        }
    }
    
    private String getDescriptionContent(T dto) {
        return getField(dto, "description");
    }

    private void setField(T dto, String fieldName, String value) {
        try {
            Field field = dto.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(dto, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            System.out.println("Error setting field " + fieldName + ": " + e.getMessage());
        }
    }

    private String getField(T dto, String fieldName) {
        try {
            Field field = dto.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            Object value = field.get(dto);
            return value != null ? value.toString() : "";
        } catch (NoSuchFieldException | IllegalAccessException e) {
            System.out.println("Error getting field " + fieldName + ": " + e.getMessage());
            return "";
        }
    }

   
}
