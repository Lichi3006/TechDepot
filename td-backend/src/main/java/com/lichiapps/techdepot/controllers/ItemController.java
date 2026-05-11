package com.lichiapps.techdepot.controllers;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.dtos.ItemDTO;
import com.lichiapps.techdepot.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lichiapps.techdepot.dtos.ItemFilterDTO;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public List<ItemDTO> getAllItemsDetallados() {
        return itemService.getAllItemsConDetalles();
    }

    @PostMapping("/search")
    public List<ItemDTO> searchItems(@RequestBody ItemFilterDTO filters) {
        return itemService.searchItems(filters);
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

    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Long id, @RequestBody ItemCreateDTO updateDTO) {
        try {
            ItemDTO itemActualizado = itemService.updateItemConDetalles(id, updateDTO);
            return ResponseEntity.ok(itemActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItemById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}