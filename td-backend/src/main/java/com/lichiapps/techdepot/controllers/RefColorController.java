package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefColor;
import com.lichiapps.techdepot.services.RefColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/colores")
@CrossOrigin(origins = "*")
public class RefColorController {
    @Autowired private RefColorService service;
    @GetMapping public List<RefColor> getAll() { return service.getAllRefColores(); }
    @PostMapping public RefColor save(@RequestBody RefColor entity) { return service.saveRefColor(entity); }
}
