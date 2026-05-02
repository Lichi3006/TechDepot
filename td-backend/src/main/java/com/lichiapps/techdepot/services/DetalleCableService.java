package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.DetalleCable;
import com.lichiapps.techdepot.repositories.DetalleCableRepository;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.RefBlindajeExternoCableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleCableService {

    @Autowired private DetalleCableRepository detalleCableRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private RefBlindajeExternoCableRepository refBlindajeExternoCableRepository;

    public DetalleCable saveDetalleCable(DetalleCable detalleCable){
        if(detalleCable.getItem() == null){
            throw new IllegalArgumentException("El item no puede ser nulo");
        }
        if(detalleCable.getBlindajeExterno() == null){
            throw new IllegalArgumentException("El blindaje externo no puede ser nulo");
        }
        if(itemRepository.findById(detalleCable.getItem().getId()).isEmpty()){
            throw new IllegalArgumentException("El item no existe");
        }
        if(refBlindajeExternoCableRepository.findById(detalleCable.getBlindajeExterno().getId()).isEmpty()){
            throw new IllegalArgumentException("El blindaje externo no existe");
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
