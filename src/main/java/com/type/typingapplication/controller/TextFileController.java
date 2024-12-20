package com.type.typingapplication.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.nio.file.Files;

@RestController
public class TextFileController {

    @GetMapping("/api/text/{filename}")
    public String getText(@PathVariable String filename) throws IOException {
        // Assuming the file is in src/main/resources/static/data/
        Resource resource = new ClassPathResource("static/" + filename);
        return new String(Files.readAllBytes(resource.getFile().toPath()));
    }
}


