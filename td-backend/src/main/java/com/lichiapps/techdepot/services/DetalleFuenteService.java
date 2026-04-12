package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.DetalleFuente;
import com.lichiapps.techdepot.repositories.DetalleFuenteRepository;
import com.lichiapps.techdepot.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DetalleFuenteService {

    @Autowired private DetalleFuenteRepository detalleFuenteRepository;
    @Autowired private ItemRepository itemRepository;

    public DetalleFuente saveDetalleFuente(DetalleFuente detalleFuente){
        List<String> errors = new ArrayList<>();
        if(detalleFuente.getItem() == null){
            errors.add("El item no puede ser nulo");
        }
        if(itemRepository.findById(detalleFuente.getItem().getId()).isPresent()){
            errors.add("El item no existe");
        }
        if(detalleFuente.getAmperaje() == null){
            errors.add("El amperaje no puede ser nulo");
        }
        if(detalleFuente.getVoltaje() == null){
            errors.add("El voltaje no puede ser nulo");
        }
        if(errors.size() > 0){
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
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
