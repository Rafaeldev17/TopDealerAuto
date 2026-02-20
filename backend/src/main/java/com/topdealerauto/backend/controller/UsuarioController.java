package com.topdealerauto.backend.controller;

import com.topdealerauto.backend.model.Usuario;
import com.topdealerauto.backend.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") 
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/cadastrar")
    public Usuario cadastrarUsuario(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario dadosLogin) {
        
        return repository.findByEmailAndSenha(dadosLogin.getEmail(), dadosLogin.getSenha())
            .map(usuario -> ResponseEntity.ok(usuario)) 
            .orElse(ResponseEntity.status(401).build()); 
    }
@GetMapping
    public java.util.List<Usuario> listarTodos() {
        return repository.findAll();
    }
@PutMapping("/atualizar/{email}")
public ResponseEntity<?> atualizarPerfil(@PathVariable String email, @RequestBody Usuario dadosAtualizados) {
    return repository.findByEmail(email) 
        .map(usuario -> {
            usuario.setTelefone(dadosAtualizados.getTelefone());
            usuario.setCep(dadosAtualizados.getCep());
            usuario.setEndereco(dadosAtualizados.getEndereco());
            repository.save(usuario);
            return ResponseEntity.ok(usuario);
        })
        .orElse(ResponseEntity.notFound().build());
}
}
