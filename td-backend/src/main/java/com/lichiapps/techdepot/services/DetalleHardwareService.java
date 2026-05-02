package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.DetalleHardware;
import com.lichiapps.techdepot.repositories.DetalleHardwareRepository;
import com.lichiapps.techdepot.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DetalleHardwareService {

    @Autowired private DetalleHardwareRepository detalleHardwareRepository;
    @Autowired private ItemRepository itemRepository;

    public DetalleHardware saveDetalleHardware(DetalleHardware detalleHardware){
        if(detalleHardware.getItem() == null){
            throw new NullPointerException("El item no puede ser nulo");
        }
        if(itemRepository.findById(detalleHardware.getItem().getId()).isPresent()){
            throw new IllegalArgumentException("El item no existe");
        }
        return detalleHardwareRepository.save(detalleHardware);
    }
    public DetalleHardware getDetalleHardwareById(Long id){
        return detalleHardwareRepository.findById(id).orElse(null);
    }
    public void deleteDetalleHardwareById(Long id){
        detalleHardwareRepository.deleteById(id);
    }
    public List<DetalleHardware> getAllDetalleHardware(){
        return detalleHardwareRepository.findAll();
    }
    public List<DetalleHardware> getAllDetalleHardwareByModeloAlfanumerico(String modeloAlfanumerico){

        List<DetalleHardware> repositorio = detalleHardwareRepository.findAll();
        List<DetalleHardware> mismoModelo = new ArrayList<>();

        for (DetalleHardware detalleHardware : repositorio) {
            if (detalleHardware.getModeloAlfanumerico() != null &&
                    detalleHardware.getModeloAlfanumerico().equals(modeloAlfanumerico)){
                mismoModelo.add(detalleHardware);
            }
        }
        return mismoModelo;
    }
}
