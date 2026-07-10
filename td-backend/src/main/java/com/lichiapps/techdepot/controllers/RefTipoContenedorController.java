package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefTipoContenedor;
import com.lichiapps.techdepot.repositories.RefTipoContenedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tipos-contenedor")
@CrossOrigin(origins = "*")
public class RefTipoContenedorController {
    @Autowired private RefTipoContenedorRepository repository;
    
    @GetMapping public List<RefTipoContenedor> getAll() { return repository.findAll(); }
    @PostMapping public RefTipoContenedor save(@RequestBody RefTipoContenedor entity) { return repository.save(entity); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Integer id) { repository.deleteById(id); }
}
