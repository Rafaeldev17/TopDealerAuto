package com.topdealerauto.backend.controller;

import com.topdealerauto.backend.model.Usuario;
import com.topdealerauto.backend.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") 
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/cadastrar")
    public Usuario cadastrarUsuario(@RequestBody Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario dadosLogin) {
        return repository.findByEmail(dadosLogin.getEmail())
                .map(usuario -> {
                    if (passwordEncoder.matches(dadosLogin.getSenha(), usuario.getSenha())) {
                        return ResponseEntity.ok(usuario);
                    }
                    return ResponseEntity.status(401).body("Senha incorreta");
                })
                .orElse(ResponseEntity.status(404).body("Usuário não encontrado"));
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
