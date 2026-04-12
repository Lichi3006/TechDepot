package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefColor;
import com.lichiapps.techdepot.repositories.RefColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefColorService {

    @Autowired private RefColorRepository refColorRepository;

    public RefColor saveRefColor(RefColor newRefColor){
        if (newRefColor.getNombre() == null){
            throw new NullPointerException("El nombre del color no puede ser nulo");
        }
        if (refColorRepository.findByNombre(newRefColor.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre del color ya existe");
        }
        return refColorRepository.save(newRefColor);
    }

    public RefColor getRefColorById(Long id){
        return refColorRepository.findById(id).orElse(null);
    }

    public void deleteRefColorById(Long id){
        refColorRepository.deleteById(id);
    }

    public List<RefColor> getAllRefColors(){
        return refColorRepository.findAll();
    }

    public void updateNombreRefColor(Long id, String nombre){
        getRefColorById(id).setNombre(nombre);
    }
}
