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
}
