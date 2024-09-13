package com.youn.vista.global.auth.controller;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youn.vista.global.auth.dto.AuthRequest;
import com.youn.vista.global.auth.dto.AuthResponse;
import com.youn.vista.global.auth.dto.UserDto;
import com.youn.vista.global.auth.service.UserService;
import com.youn.vista.global.auth.utill.JwtUtil;

import lombok.RequiredArgsConstructor;

@RequestMapping("/login")
@RequiredArgsConstructor
@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("login")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest authRequest){
        try {
            UsernamePasswordAuthenticationToken  usernamePasswordAuthenticationToken =new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword());
            authenticationManager.authenticate(usernamePasswordAuthenticationToken);
            String token = jwtUtil.generateToken(authRequest.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserDto userDto){
        try {
            userService.registerUser(userDto);
            return ResponseEntity.ok("Admin access granted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }
 
}
