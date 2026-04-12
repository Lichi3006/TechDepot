package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkProtocoloDeExtremo;
import com.lichiapps.techdepot.repositories.LinkExtremoFisicoRepository;
import com.lichiapps.techdepot.repositories.LinkProtocoloDeExtremoRepository;
import com.lichiapps.techdepot.repositories.RefProtocoloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LinkProtocoloDeExtremoService {

    @Autowired private LinkProtocoloDeExtremoRepository linkProtocoloDeExtremoRepository;
    @Autowired private RefProtocoloRepository refProtocoloRepository;
    @Autowired private LinkExtremoFisicoRepository linkExtremoFisicoRepository;

    public LinkProtocoloDeExtremo saveLinkProtocoloDeExtremo(LinkProtocoloDeExtremo linkProtocoloDeExtremo){
        List<String> errors = new ArrayList<>();
        if(linkProtocoloDeExtremo.getProtocolo() == null){
            errors.add("El protocolo no puede ser nulo");
        }
        if(linkProtocoloDeExtremo.getExtremoFisico() == null){
            errors.add("El extremo fisico no puede ser nulo");
        }
        if(refProtocoloRepository.findById(linkProtocoloDeExtremo.getProtocolo().getId()).isPresent()){
            errors.add("El protocolo no existe");
        }
        if(linkExtremoFisicoRepository.findById(linkProtocoloDeExtremo.getExtremoFisico().getId()).isPresent()){
            errors.add("El extremo fisico no existe");
        }
        if(!errors.isEmpty()){
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
        return linkProtocoloDeExtremoRepository.save(linkProtocoloDeExtremo);
    }

    public List<LinkProtocoloDeExtremo> getAllLinkProtocoloDeExtremo(){
        return linkProtocoloDeExtremoRepository.findAll();
    }

    public LinkProtocoloDeExtremo getLinkProtocoloDeExtremoById(Long id){
        return linkProtocoloDeExtremoRepository.findById(id).orElse(null);
    }

    public void deleteLinkProtocoloDeExtremoById(Long id){
        linkProtocoloDeExtremoRepository.deleteById(id);
    }

}
