package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionPuerto;
import com.lichiapps.techdepot.repositories.LinkCategoriaFuncionPuertoRepository;
import com.lichiapps.techdepot.repositories.RefCategoriaFuncionRepository;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LinkCategoriaFuncionPuertoService {

    @Autowired private LinkCategoriaFuncionPuertoRepository linkCategoriaFuncionPuertoRepository;
    @Autowired private RefCategoriaFuncionRepository refCategoriaFuncionRepository;
    @Autowired private RefPuertoRepository refPuertoRepository;

    public LinkCategoriaFuncionPuerto saveLinkCategoriaFuncionPuerto(LinkCategoriaFuncionPuerto linkCategoriaFuncionPuerto){
        List<String> errors = new ArrayList<>();
        if(linkCategoriaFuncionPuerto.getCategoriaFuncion() == null){
            errors.add("La categoria funcion no puede ser nula");
        }
        if(linkCategoriaFuncionPuerto.getPuerto() == null){
            errors.add("El puerto no puede ser nulo");
        }
        if(refCategoriaFuncionRepository.findById(linkCategoriaFuncionPuerto.getCategoriaFuncion().getId()).isPresent()){
            errors.add("La categoria funcion no existe");
        }
        if(refPuertoRepository.findById(linkCategoriaFuncionPuerto.getPuerto().getId()).isPresent()){
            errors.add("El puerto no existe");
        }
        if(!errors.isEmpty()){
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
        return linkCategoriaFuncionPuertoRepository.save(linkCategoriaFuncionPuerto);
    }
    public List<LinkCategoriaFuncionPuerto> getAllLinkCategoriaFuncionPuerto(){
        return linkCategoriaFuncionPuertoRepository.findAll();
    }
    public LinkCategoriaFuncionPuerto getLinkCategoriaFuncionPuertoById(Long id){
        return linkCategoriaFuncionPuertoRepository.findById(id).orElse(null);
    }
    public void deleteLinkCategoriaFuncionPuertoById(Long id){
        linkCategoriaFuncionPuertoRepository.deleteById(id);
    }
}
