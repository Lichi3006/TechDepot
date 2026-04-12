package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefCategoriaItem;
import com.lichiapps.techdepot.repositories.RefCategoriaItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefCategoriaItemService {

    @Autowired private RefCategoriaItemRepository refCategoriaItemRepository;

    public RefCategoriaItem saveRefCategoriaItem(RefCategoriaItem newRefCategoriaItem){
        if(newRefCategoriaItem.getNombre() == null){
            throw new NullPointerException("El nombre de la categoria no puede ser nulo");
        }
        if(refCategoriaItemRepository.findByNombre(newRefCategoriaItem.getNombre()).isPresent()) {
            throw new IllegalArgumentException("El nombre de la categoria ya existe");
        }
        return refCategoriaItemRepository.save(newRefCategoriaItem);
    }

    public RefCategoriaItem getRefCategoriaItemById(Long id){
        return refCategoriaItemRepository.findById(id).orElse(null);
    }

    public void deleteRefCategoriaItemById(Long id){
        refCategoriaItemRepository.deleteById(id);
    }

    public List<RefCategoriaItem> getAllRefCategoriaItems(){
        return refCategoriaItemRepository.findAll();
    }

    public void updateNombreRefCategoriaItem(Long id, String nombre){
        getRefCategoriaItemById(id).setNombre(nombre);
    }
}
