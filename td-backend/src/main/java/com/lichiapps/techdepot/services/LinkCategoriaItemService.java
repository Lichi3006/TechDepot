package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkCategoriaItem;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.LinkCategoriaItemRepository;
import com.lichiapps.techdepot.repositories.RefCategoriaItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkCategoriaItemService {

    @Autowired private LinkCategoriaItemRepository linkCategoriaItemRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private RefCategoriaItemRepository refCategoriaItemRepository;

    public LinkCategoriaItem saveLinkCategoriaItem(LinkCategoriaItem linkCategoriaItem){
        if(linkCategoriaItem.getItem() == null){
            throw new IllegalArgumentException("El item no puede ser nulo");
        }
        if(linkCategoriaItem.getCategoriaItem() == null){
            throw new IllegalArgumentException("La categoriaItem no puede ser nula");
        }
        if(itemRepository.findById(linkCategoriaItem.getItem().getId()).isEmpty()){
            throw new IllegalArgumentException("El item no existe");
        }
        if(refCategoriaItemRepository.findById(linkCategoriaItem.getCategoriaItem().getId()).isEmpty()){
            throw new IllegalArgumentException("La categoriaItem no existe");
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
