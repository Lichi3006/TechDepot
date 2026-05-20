package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefBlindajeExternoCable;
import com.lichiapps.techdepot.services.RefBlindajeExternoCableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/blindajes-externos")
@CrossOrigin(origins = "*")
public class RefBlindajeExternoCableController {
    @Autowired private RefBlindajeExternoCableService service;
    @GetMapping public List<RefBlindajeExternoCable> getAll() { return service.getAllRefBlindajeExternoCable(); }
    @PostMapping public RefBlindajeExternoCable save(@RequestBody RefBlindajeExternoCable data) { return service.saveRefBlindajeExternoCable(data); }
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteRefBlindajeExternoCableById(id);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }
}
