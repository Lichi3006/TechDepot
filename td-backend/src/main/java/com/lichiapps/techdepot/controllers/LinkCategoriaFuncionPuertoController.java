package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionPuerto;
import com.lichiapps.techdepot.repositories.LinkCategoriaFuncionPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/puertos-capacidades")
@CrossOrigin(origins = "*")
public class LinkCategoriaFuncionPuertoController {
    @Autowired private LinkCategoriaFuncionPuertoRepository repository;
    
    @GetMapping public List<LinkCategoriaFuncionPuerto> getAll() { return repository.findAll(); }
}
