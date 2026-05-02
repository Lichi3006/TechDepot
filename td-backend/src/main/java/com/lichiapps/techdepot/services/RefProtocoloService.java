package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefProtocolo;
import com.lichiapps.techdepot.repositories.RefProtocoloRepository;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefProtocoloService {

    @Autowired private RefProtocoloRepository refProtocoloRepository;
    @Autowired private RefPuertoRepository refPuertoRepository;

    public RefProtocolo saveRefProtocolo(RefProtocolo newRefProtocolo) {
        if (newRefProtocolo.getPuerto() == null || newRefProtocolo.getPuerto().getId() == null) {
            throw new IllegalArgumentException("El puerto es obligatorio");
        }
        if (refPuertoRepository.findById(newRefProtocolo.getPuerto().getId()).isEmpty()) {
            throw new IllegalArgumentException("El puerto no existe");
        }
        if (newRefProtocolo.getNombre() == null || newRefProtocolo.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del protocolo no puede ser nulo");
        }
        if (refProtocoloRepository.findByNombre(newRefProtocolo.getNombre()).isPresent()) {
            throw new IllegalArgumentException("El protocolo '" + newRefProtocolo.getNombre() + "' ya existe");
        }
        return refProtocoloRepository.save(newRefProtocolo);
    }

    public List<RefProtocolo> getAllRefProtocolos() {
        return refProtocoloRepository.findAll();
    }

    public RefProtocolo getRefProtocoloById(Long id) {
        return refProtocoloRepository.findById(id).orElse(null);
    }

    public void deleteRefProtocoloById(Long id) {
        refProtocoloRepository.deleteById(id);
    }
}
