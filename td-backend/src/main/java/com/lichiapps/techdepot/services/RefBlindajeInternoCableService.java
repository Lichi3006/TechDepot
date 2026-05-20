package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefBlindajeInternoCable;
import com.lichiapps.techdepot.repositories.RefBlindajeInternoCableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefBlindajeInternoCableService {

    @Autowired private RefBlindajeInternoCableRepository refBlindajeInternoCableRepository;

    public RefBlindajeInternoCable saveRefBlindajeInternoCable(RefBlindajeInternoCable newRefBlindajeInternoCable) {
        if(newRefBlindajeInternoCable.getNombre() == null){
            throw new NullPointerException("El nombre del blindaje no puede ser nulo");
        }
        if(refBlindajeInternoCableRepository.findByNombre(newRefBlindajeInternoCable.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre del blindaje ya existe");
        }
        return refBlindajeInternoCableRepository.save(newRefBlindajeInternoCable);
    }

    @Autowired private com.lichiapps.techdepot.repositories.DetalleCableRepository detalleCableRepository;

    public RefBlindajeInternoCable getRefBlindajeInternoCableById(Long id){
        return refBlindajeInternoCableRepository.findById(id).orElse(null);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteRefBlindajeInternoCableById(Long id){
        RefBlindajeInternoCable blindaje = getRefBlindajeInternoCableById(id);
        if (blindaje == null) {
            throw new IllegalArgumentException("El blindaje interno con el ID especificado no existe.");
        }
        if (detalleCableRepository.existsByBlindajeInternoId(id)) {
            throw new IllegalArgumentException("No se puede eliminar el blindaje interno '" + blindaje.getNombre() + "' porque está asociado a cables en el inventario.");
        }
        refBlindajeInternoCableRepository.deleteById(id);
    }

    public List<RefBlindajeInternoCable> getAllRefBlindajeInternoCable(){
        return refBlindajeInternoCableRepository.findAll();
    }

    public void updateNombreRefBlindajeInternoCable(Long id, String nombre){
        getRefBlindajeInternoCableById(id).setNombre(nombre);
    }
}
