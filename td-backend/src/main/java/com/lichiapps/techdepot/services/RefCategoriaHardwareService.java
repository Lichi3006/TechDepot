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

    public RefCategoriaHardware getRefCategoriaHardwareById(Long id){
        return refCategoriaHardwareRepository.findById(id).orElse(null);
    }

    public void deleteRefCategoriaHardwareById(Long id){
        refCategoriaHardwareRepository.deleteById(id);
    }

    public List<RefCategoriaHardware> getAllRefCategoriaHardware(){
        return refCategoriaHardwareRepository.findAll();
    }

    public void updateNombreRefCategoriaHardware(Long id, String nombre){
        getRefCategoriaHardwareById(id).setNombre(nombre);
    }
}
