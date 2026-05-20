package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefProtocolo;
import com.lichiapps.techdepot.services.RefProtocoloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/protocolos")
@CrossOrigin(origins = "*")
public class RefProtocoloController {
    @Autowired private RefProtocoloService service;
    @GetMapping public List<RefProtocolo> getAll() { return service.getAllRefProtocolos(); }
    @PostMapping public RefProtocolo save(@RequestBody RefProtocolo entity) { return service.saveRefProtocolo(entity); }
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteRefProtocoloById(id);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }
}
