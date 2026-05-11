package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionPuerto;
import com.lichiapps.techdepot.repositories.LinkCategoriaFuncionPuertoRepository;
import com.lichiapps.techdepot.repositories.RefCategoriaFuncionRepository;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkCategoriaFuncionPuertoService {

    @Autowired private LinkCategoriaFuncionPuertoRepository linkCategoriaFuncionPuertoRepository;
    @Autowired private RefCategoriaFuncionRepository refCategoriaFuncionRepository;
    @Autowired private RefPuertoRepository refPuertoRepository;

    public LinkCategoriaFuncionPuerto saveLinkCategoriaFuncionPuerto(LinkCategoriaFuncionPuerto linkCategoriaFuncionPuerto){
        if(linkCategoriaFuncionPuerto.getCategoriaFuncion() == null){
            throw new IllegalArgumentException("La categoria funcion no existe");
        }
        if(linkCategoriaFuncionPuerto.getPuerto() == null){
            throw new IllegalArgumentException("El puerto no existe");
        }
        if(refCategoriaFuncionRepository.findById(linkCategoriaFuncionPuerto.getCategoriaFuncion().getId()).isEmpty()){
            throw new IllegalArgumentException("La categoria funcion no existe");
        }
        if(refPuertoRepository.findById(linkCategoriaFuncionPuerto.getPuerto().getId()).isEmpty()){
            throw new IllegalArgumentException("El puerto no existe");
        }
        return linkCategoriaFuncionPuertoRepository.save(linkCategoriaFuncionPuerto);
    }

    public List<LinkCategoriaFuncionPuerto> getAllLinkCategoriaFuncionPuerto(){
        return linkCategoriaFuncionPuertoRepository.findAll();
    }

    public LinkCategoriaFuncionPuerto getLinkCategoriaFuncionPuertoById(LinkCategoriaFuncionPuerto.LinkCategoriaFuncionPuertoId id){
        return linkCategoriaFuncionPuertoRepository.findById(id).orElse(null);
    }

    public void deleteLinkCategoriaFuncionPuertoById(LinkCategoriaFuncionPuerto.LinkCategoriaFuncionPuertoId id){
        linkCategoriaFuncionPuertoRepository.deleteById(id);
    }
}
