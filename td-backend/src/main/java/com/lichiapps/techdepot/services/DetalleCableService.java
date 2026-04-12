package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.DetalleCable;
import com.lichiapps.techdepot.repositories.DetalleCableRepository;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DetalleCableService {

    @Autowired private DetalleCableRepository detalleCableRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private RefPuertoRepository refBlindajeExternoCableRepository;

    public DetalleCable saveDetalleCable(DetalleCable detalleCable){

        List<String> errors = new ArrayList<>();
        if(detalleCable.getItem() == null){
            errors.add("El item no puede ser nulo");
        }
        if(detalleCable.getBlindajeExterno() == null){
            errors.add("El blindaje externo no puede ser nulo");
        }
        if(itemRepository.findById(detalleCable.getItem().getId()).isPresent()){
            errors.add("El item no existe");
        }
        if(refBlindajeExternoCableRepository.findById(detalleCable.getBlindajeExterno().getId()).isPresent()){
            errors.add("El blindaje externo no existe");
        }
        if(errors.size() > 0){
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
        return detalleCableRepository.save(detalleCable);
    }
    public List<DetalleCable> getAllDetalleCable(){
        return detalleCableRepository.findAll();
    }

    public DetalleCable getDetalleCableById(Long id){
        return detalleCableRepository.findById(id).orElse(null);
    }
    public void deleteDetalleCableById(Long id){
        detalleCableRepository.deleteById(id);
    }
}
