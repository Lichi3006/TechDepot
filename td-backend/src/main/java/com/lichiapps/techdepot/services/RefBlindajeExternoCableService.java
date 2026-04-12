package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefBlindajeExternoCable;
import com.lichiapps.techdepot.repositories.RefBlindajeExternoCableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefBlindajeExternoCableService {

    @Autowired private RefBlindajeExternoCableRepository refBlindajeExternoCableRepository;

    public RefBlindajeExternoCable saveRefBlindajeExternoCable(RefBlindajeExternoCable newRefBlindajeExternoCable){
        if (newRefBlindajeExternoCable.getNombre() == null){
            throw new NullPointerException("El nombre del blindaje no puede ser nulo");
        }
        if(refBlindajeExternoCableRepository.findByNombre(newRefBlindajeExternoCable.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre del blindaje ya existe");
        }
        return refBlindajeExternoCableRepository.save(newRefBlindajeExternoCable);
    }

    public RefBlindajeExternoCable getRefBlindajeExternoCableById(Long id){
        return refBlindajeExternoCableRepository.findById(id).orElse(null);
    }

    public void deleteRefBlindajeExternoCableById(Long id){
        refBlindajeExternoCableRepository.deleteById(id);
    }

    public List<RefBlindajeExternoCable> getAllRefBlindajeExternoCable(){
        return refBlindajeExternoCableRepository.findAll();
    }

    public void updateNombreRefBlindajeExternoCable(Long id, String nombre){
        getRefBlindajeExternoCableById(id).setNombre(nombre);
    }
}
