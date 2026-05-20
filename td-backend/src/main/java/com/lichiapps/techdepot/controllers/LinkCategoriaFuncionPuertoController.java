package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionPuerto;
import com.lichiapps.techdepot.services.LinkCategoriaFuncionPuertoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/puertos-capacidades")
@CrossOrigin(origins = "*")
public class LinkCategoriaFuncionPuertoController {
    @Autowired private LinkCategoriaFuncionPuertoService service;
    
    @GetMapping public List<LinkCategoriaFuncionPuerto> getAll() { return service.getAllLinkCategoriaFuncionPuerto(); }

    @PostMapping
    public LinkCategoriaFuncionPuerto save(@RequestBody LinkCategoriaFuncionPuerto entity) {
        // Aseguramos que el ID compuesto esté seteado si vienen los objetos
        if (entity.getId() == null && entity.getPuerto() != null && entity.getCategoriaFuncion() != null) {
            entity.setId(new LinkCategoriaFuncionPuerto.LinkCategoriaFuncionPuertoId(
                entity.getPuerto().getId(), 
                entity.getCategoriaFuncion().getId()
            ));
        }
        return service.saveLinkCategoriaFuncionPuerto(entity);
    }
}
