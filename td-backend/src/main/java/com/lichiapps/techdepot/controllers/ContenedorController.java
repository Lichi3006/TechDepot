package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.Contenedor;
import com.lichiapps.techdepot.services.ContenedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contenedores")
@CrossOrigin(origins = "*")
public class ContenedorController {
    @Autowired private ContenedorService service;
    @GetMapping public List<Contenedor> getAll() { return service.getAllContenedores(); }
    @PostMapping public Contenedor save(@RequestBody Contenedor entity) { return service.saveContenedor(entity); }

    @PutMapping("/{id}")
    public Contenedor update(@PathVariable Long id, @RequestBody Contenedor entity) {
        return service.updateContenedor(id, entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteContenedorById(id);
    }
}
