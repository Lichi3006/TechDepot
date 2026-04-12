package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefEstado;
import com.lichiapps.techdepot.repositories.RefEstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefEstadoService {

    @Autowired private RefEstadoRepository refEstadoRepository;

    public RefEstado saveRefEstado(RefEstado refEstado){
        if(refEstado.getNombre() == null){
            throw new NullPointerException ("El nombre del estado no puede ser nulo");
        }
        if(refEstadoRepository.findByNombre(refEstado.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre del estado ya existe");
        }
        return refEstadoRepository.save(refEstado);
    }

    public RefEstado getRefEstadoById(Long id){
        return refEstadoRepository.findById(id).orElse(null);
    }

    public void deleteRefEstadoById(Long id){
        refEstadoRepository.deleteById(id);
    }

    public void updateNombreRefEstado(Long id, String nombre){
        getRefEstadoById(id).setNombre(nombre);
    }

    public List<RefEstado> getAllRefEstados(){
        return refEstadoRepository.findAll();
    }
}
