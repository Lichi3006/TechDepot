package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefPuerto;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefPuertoService {


@Autowired private RefPuertoRepository refPuertoRepository;

    public RefPuerto saveRefPuerto(RefPuerto newRefPuerto){

        if(newRefPuerto.getNombre() == null){
            throw new IllegalArgumentException("El nombre del puerto no puede ser nulo");
        }
        if(refPuertoRepository.findByNombre(newRefPuerto.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre del puerto ya existe");
        }
        return refPuertoRepository.save(newRefPuerto);
    }
    public RefPuerto getRefPuertoById(Long id){
        return refPuertoRepository.findById(id).orElse(null);
    }
    public void deleteRefPuertoById(Long id){
        refPuertoRepository.deleteById(id);
    }
    public void updateNombreRefPuerto(Long id, String nombre){
        getRefPuertoById(id).setNombre(nombre);
    }
    public List<RefPuerto> getAllRefPuertos(){
        return refPuertoRepository.findAll();
    }
}
