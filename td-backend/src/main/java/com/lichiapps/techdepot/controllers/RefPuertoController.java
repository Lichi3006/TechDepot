package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefPuerto;
import com.lichiapps.techdepot.services.RefPuertoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/puertos")
@CrossOrigin(origins = "*")
public class RefPuertoController {
    @Autowired private RefPuertoService service;
    @GetMapping public List<RefPuerto> getAll() { return service.getAllRefPuertos(); }
    @PostMapping public RefPuerto save(@RequestBody RefPuerto entity) { return service.saveRefPuerto(entity); }
}
