package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionItem;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.LinkCategoriaFuncionItemRepository;
import com.lichiapps.techdepot.repositories.RefCategoriaFuncionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LinkCategoriaFuncionItemService {

    @Autowired private LinkCategoriaFuncionItemRepository linkCategoriaFuncionItemRepository;
    @Autowired private RefCategoriaFuncionRepository refCategoriaFuncionRepository;
    @Autowired private ItemRepository itemRepository;

    public LinkCategoriaFuncionItem saveLinkCategoriaFuncionItem(LinkCategoriaFuncionItem linkCategoriaFuncionItem){
        List<String> errors = new ArrayList<>();
        if(linkCategoriaFuncionItem.getCategoriaFuncion() == null){
            errors.add("La categoria funcion no puede ser nula");
        }
        if(linkCategoriaFuncionItem.getItem() == null){
            errors.add("El item no puede ser nulo");
        }
        if(refCategoriaFuncionRepository.findById(linkCategoriaFuncionItem.getCategoriaFuncion().getId()).isPresent()){
            errors.add("La categoria funcion no existe");
        }
        if(itemRepository.findById(linkCategoriaFuncionItem.getItem().getId()).isPresent()){
            errors.add("El item no existe");
        }
        if(!errors.isEmpty()){
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
        return linkCategoriaFuncionItemRepository.save(linkCategoriaFuncionItem);
    }
    public List<LinkCategoriaFuncionItem> getAllLinkCategoriaFuncionItem(){
        return linkCategoriaFuncionItemRepository.findAll();
    }
    public LinkCategoriaFuncionItem getLinkCategoriaFuncionItemById(Long id){
        return linkCategoriaFuncionItemRepository.findById(id).orElse(null);
    }
    public void deleteLinkCategoriaFuncionItemById(Long id){
        linkCategoriaFuncionItemRepository.deleteById(id);
    }
}
