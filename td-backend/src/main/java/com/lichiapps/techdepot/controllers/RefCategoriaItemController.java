package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.entities.RefCategoriaItem;
import com.lichiapps.techdepot.services.RefCategoriaItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias-item")
@CrossOrigin(origins = "*")
public class RefCategoriaItemController {
    @Autowired private RefCategoriaItemService service;
    @GetMapping public List<RefCategoriaItem> getAll() { return service.getAllRefCategoriaItems(); }
    @PostMapping public RefCategoriaItem save(@RequestBody RefCategoriaItem entity) { return service.saveRefCategoriaItem(entity); }
}
