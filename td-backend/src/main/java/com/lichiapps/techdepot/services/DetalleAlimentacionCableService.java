package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.DetalleAlimentacionCable;
import com.lichiapps.techdepot.repositories.DetalleAlimentacionCableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DetalleAlimentacionCableService {

    @Autowired private DetalleAlimentacionCableRepository detalleAlimentacionCableRepository;
    @Autowired private DetalleCableService detalleCableRepository;

    public DetalleAlimentacionCable saveDetalleAlimentacionCable(DetalleAlimentacionCable detalleAlimentacionCable){
        List<String> errors = new ArrayList<>();
        if(detalleAlimentacionCable.getDetalleCable() == null){
            errors.add("El detalle cable no puede ser nulo");
        }
        if(detalleAlimentacionCable.getAmperajeMax() == null){
            errors.add("El amperaje max no puede ser nulo");
        }
        if(detalleAlimentacionCableRepository.findById(detalleAlimentacionCable.getDetalleCable().getId()).isPresent()){
            errors.add("El detalle cable no existe");
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
}
