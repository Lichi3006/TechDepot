package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionPuerto;
import com.lichiapps.techdepot.entities.RefProtocolo;
import com.lichiapps.techdepot.repositories.LinkCategoriaFuncionPuertoRepository;
import com.lichiapps.techdepot.repositories.RefProtocoloRepository;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.lichiapps.techdepot.repositories.LinkProtocoloDeExtremoRepository;

@Service
public class RefProtocoloService {

    @Autowired private RefProtocoloRepository refProtocoloRepository;
    @Autowired private RefPuertoRepository refPuertoRepository;
    @Autowired private LinkCategoriaFuncionPuertoRepository capacityRepository;
    @Autowired private LinkProtocoloDeExtremoRepository linkProtocoloDeExtremoRepository;

    @Transactional
    public RefProtocolo saveRefProtocolo(RefProtocolo newRefProtocolo) {
        if (newRefProtocolo.getPuerto() == null || newRefProtocolo.getPuerto().getId() == null) {
            throw new IllegalArgumentException("El puerto es obligatorio");
        }
        if (newRefProtocolo.getCategoriaFuncion() == null || newRefProtocolo.getCategoriaFuncion().getId() == null) {
            throw new IllegalArgumentException("La función es obligatoria");
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

        // ASEGURAR CAPACIDAD: Antes de guardar el protocolo, el puerto DEBE tener esa capacidad registrada
        LinkCategoriaFuncionPuerto.LinkCategoriaFuncionPuertoId capId = 
            new LinkCategoriaFuncionPuerto.LinkCategoriaFuncionPuertoId(
                newRefProtocolo.getPuerto().getId(), 
                newRefProtocolo.getCategoriaFuncion().getId()
            );

        if (!capacityRepository.existsById(capId)) {
            LinkCategoriaFuncionPuerto cap = new LinkCategoriaFuncionPuerto();
            cap.setId(capId);
            cap.setPuerto(newRefProtocolo.getPuerto());
            cap.setCategoriaFuncion(newRefProtocolo.getCategoriaFuncion());
            capacityRepository.save(cap);
        }

        return refProtocoloRepository.save(newRefProtocolo);
    }

    public List<RefProtocolo> getAllRefProtocolos() {
        return refProtocoloRepository.findAll();
    }

    public RefProtocolo getRefProtocoloById(Long id) {
        return refProtocoloRepository.findById(id).orElse(null);
    }

    @Transactional
    public void deleteRefProtocoloById(Long id) {
        RefProtocolo protocolo = getRefProtocoloById(id);
        if (protocolo == null) {
            throw new IllegalArgumentException("El protocolo con el ID especificado no existe.");
        }
        if (linkProtocoloDeExtremoRepository.existsByProtocoloId(id)) {
            throw new IllegalArgumentException("No se puede eliminar el protocolo '" + protocolo.getNombre() + "' porque está asociado a ítems en el inventario.");
        }
        refProtocoloRepository.deleteById(id);
    }
}
