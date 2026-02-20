package com.topdealerauto.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        // Isso inicia o Spring Boot e procura seus Controllers e Repositories
        SpringApplication.run(BackendApplication.class, args);
    }
    
}