package com.youn.vista.domain.board.service.impl;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.youn.vista.domain.board.dto.CodingBoardDto;
import com.youn.vista.domain.board.service.BoardService;


@Service
public class CodingBoardServiceImpl implements BoardService<CodingBoardDto>{

    @Override
    public List<CodingBoardDto> getBoardList() {
        return fetchFileList().stream().map(filePath->fileRead(filePath)).toList();
    }

    private List<Path> fetchFileList(){
        Path startPath = Paths.get("..","coding","solution");
        List<Path> javaFiles = new ArrayList<>();
        Pattern javaFilePattern = Pattern.compile(".*\\.java$");
         try {
            Files.walkFileTree(startPath, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    if (javaFilePattern.matcher(file.toString()).matches()) {
                        javaFiles.add(file);
                    }
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }

        return javaFiles;
    }

    private CodingBoardDto fileRead(Path filePath){
        try {
            String title  = "";
            String question = "";
            String content = Files.readString(filePath);
            String javadoc ="";
            String level ="";

            Pattern javadocPattern = Pattern.compile("/\\*\\*[^*]*(\\*(?!/)[^*]*)*\\*/", Pattern.DOTALL);
            Matcher javadocMatcher = javadocPattern.matcher(content);
            if(javadocMatcher.find()){
                javadoc = javadocMatcher.group();
                content = content.replace(javadoc, "");
            }
           
            Pattern titlePattern = Pattern.compile("@title\\s*(.*)");
            Matcher titleMatcher = titlePattern.matcher(javadoc);
            if (titleMatcher.find()) {
                title = titleMatcher.group(1).trim();
            }

            Pattern questionPattern = Pattern.compile("@question\\s*([^*\\s].*?)(?=\\s*\\*\\s*\\*/|\\s*\\*/|$)", Pattern.DOTALL);
            Matcher questionMatcher = questionPattern.matcher(javadoc);

            if (questionMatcher.find()) {
                question = questionMatcher.group(1).trim().replaceAll("(?m)^\\s*\\*\\s*", "");
            }

            Pattern levelPattern = Pattern.compile("@level\\s*(.*)");
            Matcher levelMatcher = levelPattern.matcher(javadoc);
            if (levelMatcher.find()) {
                level = levelMatcher.group(1).trim();
            }
            

            BasicFileAttributes attrs = Files.readAttributes(filePath, BasicFileAttributes.class);
            LocalDate lastModifiedDate = attrs.lastModifiedTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String formattedDate = lastModifiedDate.format(formatter);
            
          
            return CodingBoardDto.builder()
                .title(title)
                .question(question)
                .content(content)
                .writeDate(formattedDate)
                .level(level)
                .build();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

}
