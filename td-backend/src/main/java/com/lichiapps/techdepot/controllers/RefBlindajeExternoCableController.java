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
}
