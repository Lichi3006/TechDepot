package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaItem;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.LinkCategoriaItemRepository;
import com.lichiapps.techdepot.repositories.RefCategoriaItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LinkCategoriaItemService {

    @Autowired private LinkCategoriaItemRepository linkCategoriaItemRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private RefCategoriaItemRepository refCategoriaItemRepository;

    public LinkCategoriaItem saveLinkCategoriaItem(LinkCategoriaItem linkCategoriaItem){
        List<String> errors = new ArrayList<>();
        if(linkCategoriaItem.getItem() == null){
            errors.add("El item no puede ser nulo");
        }
        if(linkCategoriaItem.getCategoriaItem() == null){
            errors.add("La categoriaItem no puede ser nula");
        }
        if(itemRepository.findById(linkCategoriaItem.getItem().getId()).isPresent()){
            errors.add("El item no existe");
        }
        if(refCategoriaItemRepository.findById(linkCategoriaItem.getCategoriaItem().getId()).isPresent()){
            errors.add("La categoriaItem no existe");
        }
        if(!errors.isEmpty()){
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
        return linkCategoriaItemRepository.save(linkCategoriaItem);
    }
    public List<LinkCategoriaItem> getAllLinkCategoriaItem(){
        return linkCategoriaItemRepository.findAll();
    }
    public LinkCategoriaItem getLinkCategoriaItemById(Long id){
        return linkCategoriaItemRepository.findById(id).orElse(null);
    }
    public void deleteLinkCategoriaItemById(Long id){
        linkCategoriaItemRepository.deleteById(id);
    }
}
