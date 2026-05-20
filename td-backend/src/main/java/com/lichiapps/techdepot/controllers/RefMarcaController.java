package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefMarca;
import com.lichiapps.techdepot.services.RefMarcaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@CrossOrigin(origins = "*") // Permitir solicitudes desde cualquier origen
public class RefMarcaController {

    @Autowired
    private RefMarcaService refMarcaService;

    @GetMapping
    public List<RefMarca> getAllMarcas(){
        return refMarcaService.getAllRefMarcas();
    }
    @PostMapping
    public RefMarca saveMarca(@RequestBody RefMarca refMarca){
        return refMarcaService.saveRefMarca(refMarca);
    }
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            refMarcaService.deleteRefMarcaById(id);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }
}
