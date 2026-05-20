package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefCategoriaHardware;
import com.lichiapps.techdepot.services.RefCategoriaHardwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias-hardware")
@CrossOrigin(origins = "*")
public class RefCategoriaHardwareController {

    @Autowired
    private RefCategoriaHardwareService refCategoriaHardwareService;

    @GetMapping
    public List<RefCategoriaHardware> getAll() {
        return refCategoriaHardwareService.getAllRefCategoriaHardware();
    }

    @PostMapping
    public RefCategoriaHardware save(@RequestBody RefCategoriaHardware data) {
        return refCategoriaHardwareService.saveRefCategoriaHardware(data);
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            refCategoriaHardwareService.deleteRefCategoriaHardwareById(id);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }
}
