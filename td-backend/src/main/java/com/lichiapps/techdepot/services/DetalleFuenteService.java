package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.DetalleFuente;
import com.lichiapps.techdepot.repositories.DetalleFuenteRepository;
import com.lichiapps.techdepot.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleFuenteService {

    @Autowired private DetalleFuenteRepository detalleFuenteRepository;
    @Autowired private ItemRepository itemRepository;

    public DetalleFuente saveDetalleFuente(DetalleFuente detalleFuente){
        if(detalleFuente.getItem() == null){
            throw new IllegalArgumentException("El item no puede ser nulo");
        }
        if(itemRepository.findById(detalleFuente.getItem().getId()).isEmpty()){
            throw new IllegalArgumentException("El item no existe");
        }
        if(detalleFuente.getAmperaje() == null){
            throw new IllegalArgumentException("El amperaje no puede ser nulo");
        }
        if(detalleFuente.getVoltaje() == null){
            throw new IllegalArgumentException("El voltaje no puede ser nulo");
        }
        return detalleFuenteRepository.save(detalleFuente);
    }

    public DetalleFuente getDetalleFuenteById(Long id){
        return detalleFuenteRepository.findById(id).orElse(null);
    }

    public void deleteDetalleFuenteById(Long id){
        detalleFuenteRepository.deleteById(id);
    }

    public List<DetalleFuente> getAllDetalleFuentes(){
        return detalleFuenteRepository.findAll();
    }
}
