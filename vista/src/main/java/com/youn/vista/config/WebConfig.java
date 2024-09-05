package com.youn.vista.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.youn.vista.intercepter.LogIntercepter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer{

    @Autowired
    private LogIntercepter logIntercepter;

    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET","POST","PUT","OPTIONS","DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
    }



    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(logIntercepter)
                .addPathPatterns("/**"); 
    }
}
