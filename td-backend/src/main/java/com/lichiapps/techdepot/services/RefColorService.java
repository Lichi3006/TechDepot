package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefColor;
import com.lichiapps.techdepot.repositories.RefColorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefColorService {

    @Autowired private RefColorRepository refColorRepository;

    public RefColor saveRefColor(RefColor newRefColor){
        if (newRefColor.getCodigoHex() == null || newRefColor.getCodigoHex().isBlank()){
            throw new IllegalArgumentException("El color no puede estar vacio");
        }
        if (refColorRepository.findByCodigoHex(newRefColor.getCodigoHex()).isPresent()){
            throw new IllegalArgumentException("El color '" + newRefColor.getCodigoHex() + "' ya existe");
        }
        return refColorRepository.save(newRefColor);
    }

    public RefColor getRefColorById(Long id){
        return refColorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Color con ID " + id + " no encontrado"));
    }

    public void deleteRefColorById(Long id){
        getRefColorById(id);
        refColorRepository.deleteById(id);
    }

    public List<RefColor> getAllRefColores(){
        return refColorRepository.findAll();
    }
}
