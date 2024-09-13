package com.youn.vista.domain.board.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youn.vista.domain.board.dto.CodingBoardDto;
import com.youn.vista.domain.board.service.BoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/board/coding")
@RequiredArgsConstructor
public class CodingBoardController {

    private final BoardService<CodingBoardDto> codingBoardService;

    @GetMapping
    public ResponseEntity<List<CodingBoardDto>> getBoardList(){
        return ResponseEntity.ok(codingBoardService.getBoardList());
    }

}
