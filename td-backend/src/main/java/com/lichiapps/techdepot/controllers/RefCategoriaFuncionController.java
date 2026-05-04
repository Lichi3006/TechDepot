package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefCategoriaFuncion;
import com.lichiapps.techdepot.services.RefCategoriaFuncionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias-funcion")
@CrossOrigin(origins = "*")
public class RefCategoriaFuncionController {
    @Autowired private RefCategoriaFuncionService service;
    
    @GetMapping public List<RefCategoriaFuncion> getAll() { return service.getAllRefCategoriaFuncion(); }
    @PostMapping public RefCategoriaFuncion save(@RequestBody RefCategoriaFuncion entity) { return service.saveRefCategoriaFuncion(entity); }
}
