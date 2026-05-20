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

    @Autowired private com.lichiapps.techdepot.repositories.DetalleCableRepository detalleCableRepository;

    public RefBlindajeExternoCable getRefBlindajeExternoCableById(Long id){
        return refBlindajeExternoCableRepository.findById(id).orElse(null);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteRefBlindajeExternoCableById(Long id){
        RefBlindajeExternoCable blindaje = getRefBlindajeExternoCableById(id);
        if (blindaje == null) {
            throw new IllegalArgumentException("El blindaje externo con el ID especificado no existe.");
        }
        if (detalleCableRepository.existsByBlindajeExternoId(id)) {
            throw new IllegalArgumentException("No se puede eliminar el blindaje externo '" + blindaje.getNombre() + "' porque está asociado a cables en el inventario.");
        }
        refBlindajeExternoCableRepository.deleteById(id);
    }

    public List<RefBlindajeExternoCable> getAllRefBlindajeExternoCable(){
        return refBlindajeExternoCableRepository.findAll();
    }

    public void updateNombreRefBlindajeExternoCable(Long id, String nombre){
        getRefBlindajeExternoCableById(id).setNombre(nombre);
    }
}
