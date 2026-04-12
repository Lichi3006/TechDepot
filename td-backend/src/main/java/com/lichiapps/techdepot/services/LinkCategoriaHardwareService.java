package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaHardware;
import com.lichiapps.techdepot.repositories.LinkCategoriaHardwareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LinkCategoriaHardwareService {

    @Autowired
    private LinkCategoriaHardwareRepository repository;

    public List<LinkCategoriaHardware> getAll() {
        return repository.findAll();
    }

    public LinkCategoriaHardware save(LinkCategoriaHardware link) {
        return repository.save(link);
    }
}