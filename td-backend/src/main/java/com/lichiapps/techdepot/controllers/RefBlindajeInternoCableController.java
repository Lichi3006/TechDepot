package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefBlindajeInternoCable;
import com.lichiapps.techdepot.services.RefBlindajeInternoCableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/blindajes-internos")
@CrossOrigin(origins = "*")
public class RefBlindajeInternoCableController {
    @Autowired private RefBlindajeInternoCableService service;
    @GetMapping public List<RefBlindajeInternoCable> getAll() { return service.getAllRefBlindajeInternoCable(); }
    @PostMapping public RefBlindajeInternoCable save(@RequestBody RefBlindajeInternoCable data) { return service.saveRefBlindajeInternoCable(data); }
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteRefBlindajeInternoCableById(id);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }
}
