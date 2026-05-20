package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefCategoriaHardware;
import com.lichiapps.techdepot.repositories.RefCategoriaHardwareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefCategoriaHardwareService {

    @Autowired private RefCategoriaHardwareRepository refCategoriaHardwareRepository;

    public RefCategoriaHardware saveRefCategoriaHardware(RefCategoriaHardware newRefCategoriaHardware){
        if(newRefCategoriaHardware.getNombre() == null){
            throw new NullPointerException("El nombre de la categoria no puede ser nulo");
        }
        if(refCategoriaHardwareRepository.findByNombre(newRefCategoriaHardware.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre de la categoria ya existe");
        }
        return refCategoriaHardwareRepository.save(newRefCategoriaHardware);
    }

    @Autowired private com.lichiapps.techdepot.repositories.LinkCategoriaHardwareRepository linkCategoriaHardwareRepository;

    public RefCategoriaHardware getRefCategoriaHardwareById(Long id){
        return refCategoriaHardwareRepository.findById(id).orElse(null);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteRefCategoriaHardwareById(Long id){
        RefCategoriaHardware categoria = getRefCategoriaHardwareById(id);
        if (categoria == null) {
            throw new IllegalArgumentException("La categoría de hardware con el ID especificado no existe.");
        }
        if (linkCategoriaHardwareRepository.existsByRefCategoriaHardwareId(id)) {
            throw new IllegalArgumentException("No se puede eliminar la categoría '" + categoria.getNombre() + "' porque está asociada a ítems de hardware en el inventario.");
        }
        refCategoriaHardwareRepository.deleteById(id);
    }

    public List<RefCategoriaHardware> getAllRefCategoriaHardware(){
        return refCategoriaHardwareRepository.findAll();
    }

    public void updateNombreRefCategoriaHardware(Long id, String nombre){
        getRefCategoriaHardwareById(id).setNombre(nombre);
    }
}
