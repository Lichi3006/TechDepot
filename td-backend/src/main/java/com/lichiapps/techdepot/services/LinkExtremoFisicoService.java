package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkExtremoFisico;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.LinkExtremoFisicoRepository;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkExtremoFisicoService {

    @Autowired private LinkExtremoFisicoRepository linkExtremoFisicoRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private RefPuertoRepository refPuertoRepository;

    public LinkExtremoFisico saveLinkExtremoFisico(LinkExtremoFisico linkExtremoFisico){
        if(linkExtremoFisico.getItem() == null){
            throw new IllegalArgumentException("El item no puede ser nulo");
        }
        if(linkExtremoFisico.getPuerto() == null){
            throw new IllegalArgumentException("El puerto no puede ser nulo");
        }
        if(itemRepository.findById(linkExtremoFisico.getItem().getId()).isEmpty()){
            throw new IllegalArgumentException("El item no existe");
        }
        if(refPuertoRepository.findById(linkExtremoFisico.getPuerto().getId()).isEmpty()){
            throw new IllegalArgumentException("El puerto no existe");
        }
        return linkExtremoFisicoRepository.save(linkExtremoFisico);
    }

    public List<LinkExtremoFisico> getAllLinkExtremoFisico(){
        return linkExtremoFisicoRepository.findAll();
    }

    public LinkExtremoFisico getLinkExtremoFisicoById(Long id){
        return linkExtremoFisicoRepository.findById(id).orElse(null);
    }

    public void deleteLinkExtremoFisicoById(Long id){
        linkExtremoFisicoRepository.deleteById(id);
    }
}
