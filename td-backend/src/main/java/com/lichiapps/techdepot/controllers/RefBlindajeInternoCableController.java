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
}
