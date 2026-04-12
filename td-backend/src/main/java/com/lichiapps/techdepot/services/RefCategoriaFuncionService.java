package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefCategoriaFuncion;
import com.lichiapps.techdepot.repositories.RefCategoriaFuncionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefCategoriaFuncionService {

    @Autowired private RefCategoriaFuncionRepository refCategoriaFuncionRepository;

    public RefCategoriaFuncion saveRefCategoriaFuncion(RefCategoriaFuncion newRefCategoriaFuncion){
        if(newRefCategoriaFuncion.getNombre() == null){
            throw new NullPointerException("El nombre de la categoria no puede ser nulo");
        }
        if(refCategoriaFuncionRepository.findByNombre(newRefCategoriaFuncion.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre de la categoria ya existe");
        }
        return refCategoriaFuncionRepository.save(newRefCategoriaFuncion);
    }
    public RefCategoriaFuncion getRefCategoriaFuncionById(Long id){
        return refCategoriaFuncionRepository.findById(id).orElse(null);
    }
    public void deleteRefCategoriaFuncionById(Long id){
        refCategoriaFuncionRepository.deleteById(id);
    }
    public List<RefCategoriaFuncion> getAllRefCategoriaFuncion(){
        return refCategoriaFuncionRepository.findAll();
    }
    public void updateNombreRefCategoriaFuncion(Long id, String nombre){
        getRefCategoriaFuncionById(id).setNombre(nombre);
    }
}
