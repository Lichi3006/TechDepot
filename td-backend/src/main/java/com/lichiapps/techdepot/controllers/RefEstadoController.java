package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefEstado;
import com.lichiapps.techdepot.services.RefEstadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estados")
@CrossOrigin(origins = "*")
public class RefEstadoController {
    @Autowired private RefEstadoService service;
    @GetMapping public List<RefEstado> getAll() { return service.getAllRefEstados(); }
    @PostMapping public RefEstado save(@RequestBody RefEstado entity) { return service.saveRefEstado(entity); }
}
