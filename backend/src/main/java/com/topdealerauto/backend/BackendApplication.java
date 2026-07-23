package com.topdealerauto.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        // inicia o Spring Boot e procura Controllers e Repositories
        SpringApplication.run(BackendApplication.class, args);
    }
    
}