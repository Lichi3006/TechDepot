package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaHardware;
import com.lichiapps.techdepot.repositories.DetalleHardwareRepository;
import com.lichiapps.techdepot.repositories.LinkCategoriaHardwareRepository;
import com.lichiapps.techdepot.repositories.RefCategoriaHardwareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkCategoriaHardwareService {

    @Autowired private LinkCategoriaHardwareRepository linkCategoriaHardwareRepository;
    @Autowired private DetalleHardwareRepository detalleHardwareRepository;
    @Autowired private RefCategoriaHardwareRepository refCategoriaHardwareRepository;

    public LinkCategoriaHardware save(LinkCategoriaHardware link) {
        if (link.getDetalleHardware() == null) {
            throw new IllegalArgumentException("El detalle hardware no puede ser nulo");
        }
        if (link.getRefCategoriaHardware() == null) {
            throw new IllegalArgumentException("La categoría de hardware no puede ser nula");
        }
        if (detalleHardwareRepository.findById(link.getDetalleHardware().getId()).isEmpty()) {
            throw new IllegalArgumentException("El detalle hardware no existe");
        }
        if (refCategoriaHardwareRepository.findById(link.getRefCategoriaHardware().getId()).isEmpty()) {
            throw new IllegalArgumentException("La categoría de hardware no existe");
        }
        return linkCategoriaHardwareRepository.save(link);
    }

    public List<LinkCategoriaHardware> getAll() {
        return linkCategoriaHardwareRepository.findAll();
    }

    public void deleteByHardwareId(Long hardwareId) {
        List<LinkCategoriaHardware> links = linkCategoriaHardwareRepository.findByDetalleHardwareId(hardwareId);
        linkCategoriaHardwareRepository.deleteAll(links);
    }
}
