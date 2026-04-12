package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefProtocolo;
import com.lichiapps.techdepot.repositories.RefProtocoloRepository;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RefProtocoloService {

@Autowired private RefProtocoloRepository refProtocoloRepository;
@Autowired private RefPuertoRepository refPuertoRepository;

    public RefProtocolo saveRefProtocolo(RefProtocolo newRefProtocolo) {

        List<String> errors = new ArrayList<>();
        if(!refPuertoRepository.findById(newRefProtocolo.getPuerto().getId()).isPresent()){
            errors.add("El puerto no existe");
        }

        if(newRefProtocolo.getNombre() == null){
            errors.add("El nombre del protocolo no puede ser nulo");
        }

        if(refProtocoloRepository.findByNombre(newRefProtocolo.getNombre()).isPresent()){
            errors.add("El nombre del protocolo no puede ser nulo");
        }

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
        return refProtocoloRepository.save(newRefProtocolo);
    }
    public List<RefProtocolo> getAllRefProtocolos(){
        return refProtocoloRepository.findAll();
    }
    public RefProtocolo getRefProtocoloById(Long id){
        return refProtocoloRepository.findById(id).orElse(null);
    }
    public void deleteRefProtocoloById(Long id){
        refProtocoloRepository.deleteById(id);
    }
}
