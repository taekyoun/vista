package com.youn.vista.intercepter;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LogIntercepter implements HandlerInterceptor{

    private static final Logger logger = LoggerFactory.getLogger(LogIntercepter.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.info("요청 받은 URI:("+request.getMethod()+")" + request.getRequestURI());
        return true; 
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        logger.info("요청 작업 완료 ");
    }
}
