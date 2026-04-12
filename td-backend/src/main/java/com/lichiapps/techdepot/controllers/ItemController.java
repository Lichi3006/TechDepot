package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.dtos.ItemDTO;
import com.lichiapps.techdepot.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping("/detallados")
    public List<ItemDTO> getAllItemsDetallados() {
        return itemService.getAllItemsConDetalles();
    }
    
    @PostMapping
    public ResponseEntity<ItemDTO> createItem(@RequestBody ItemCreateDTO createDTO) {
        try {
            ItemDTO itemCreado = itemService.createItemConDetalles(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(itemCreado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}