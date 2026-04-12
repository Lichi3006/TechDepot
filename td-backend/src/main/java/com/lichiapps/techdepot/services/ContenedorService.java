package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.Contenedor;
import com.lichiapps.techdepot.repositories.ContenedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ContenedorService {

    @Autowired ContenedorRepository contenedorRepository;
    
    public Contenedor saveContenedor(Contenedor nuevoContenedor){ // El UUID del contenedor es generado
        UUID uuid = UUID.randomUUID();
        nuevoContenedor.setQrUUID(uuid.toString());
        return contenedorRepository.save(nuevoContenedor);
    }
    public List<Contenedor> getAllContenedores(){
        return contenedorRepository.findAll();
    }
    public void DeleteContenedorById(Long id){
        contenedorRepository.deleteById(id);
    }
    public Contenedor getContenedorById(Long id){
        return contenedorRepository.findById(id).orElse(null);
    }
}
