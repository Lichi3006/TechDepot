package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.DetalleAlimentacionCable;
import com.lichiapps.techdepot.repositories.DetalleAlimentacionCableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleAlimentacionCableService {

    @Autowired private DetalleAlimentacionCableRepository detalleAlimentacionCableRepository;

    public DetalleAlimentacionCable saveDetalleAlimentacionCable(DetalleAlimentacionCable detalleAlimentacionCable){
        if(detalleAlimentacionCable.getDetalleCable() == null){
            throw new IllegalArgumentException("El detalle cable no puede ser nulo");
        }
        if(detalleAlimentacionCable.getAmperajeMax() == null){
            throw new IllegalArgumentException("El amperaje max no puede ser nulo");
        }
        return detalleAlimentacionCableRepository.save(detalleAlimentacionCable);
    }

    public List<DetalleAlimentacionCable> getAllDetalleAlimentacionCable(){
        return detalleAlimentacionCableRepository.findAll();
    }

    public DetalleAlimentacionCable getDetalleAlimentacionCableById(Long id){
        return detalleAlimentacionCableRepository.findById(id).orElse(null);
    }

    public void deleteDetalleAlimentacionCableById(Long id){
        detalleAlimentacionCableRepository.deleteById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteDetalleAlimentacionCableByDetalleCableId(Long detalleCableId) {
        detalleAlimentacionCableRepository.deleteByDetalleCableId(detalleCableId);
    }
}
