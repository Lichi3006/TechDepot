package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionItem;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.LinkCategoriaFuncionItemRepository;
import com.lichiapps.techdepot.repositories.RefCategoriaFuncionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkCategoriaFuncionItemService {

    @Autowired private LinkCategoriaFuncionItemRepository linkCategoriaFuncionItemRepository;
    @Autowired private RefCategoriaFuncionRepository refCategoriaFuncionRepository;
    @Autowired private ItemRepository itemRepository;

    public LinkCategoriaFuncionItem saveLinkCategoriaFuncionItem(LinkCategoriaFuncionItem linkCategoriaFuncionItem){
        if(linkCategoriaFuncionItem.getCategoriaFuncion() == null){
            throw new IllegalArgumentException("La categoria funcion no puede ser nula");
        }
        if(linkCategoriaFuncionItem.getItem() == null){
            throw new IllegalArgumentException("El item no puede ser nulo");
        }
        if(refCategoriaFuncionRepository.findById(linkCategoriaFuncionItem.getCategoriaFuncion().getId()).isEmpty()){
            throw new IllegalArgumentException("La categoria funcion no existe");
        }
        if(itemRepository.findById(linkCategoriaFuncionItem.getItem().getId()).isEmpty()){
            throw new IllegalArgumentException("El item no existe");
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
