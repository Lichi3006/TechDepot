package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.LinkProtocoloDeExtremo;
import com.lichiapps.techdepot.repositories.LinkProtocoloDeExtremoRepository;
import com.lichiapps.techdepot.repositories.RefProtocoloRepository;
import com.lichiapps.techdepot.repositories.LinkExtremoFisicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkProtocoloDeExtremoService {

    @Autowired private LinkProtocoloDeExtremoRepository linkProtocoloDeExtremoRepository;
    @Autowired private RefProtocoloRepository refProtocoloRepository;
    @Autowired private LinkExtremoFisicoRepository linkExtremoFisicoRepository;

    public LinkProtocoloDeExtremo saveLinkProtocoloDeExtremo(LinkProtocoloDeExtremo linkProtocoloDeExtremo){
        if(linkProtocoloDeExtremo.getProtocolo() == null){
            throw new IllegalArgumentException("El protocolo no puede ser nulo");
        }
        if(linkProtocoloDeExtremo.getExtremoFisico() == null){
            throw new IllegalArgumentException("El extremo fisico no puede ser nulo");
        }
        if(refProtocoloRepository.findById(linkProtocoloDeExtremo.getProtocolo().getId()).isEmpty()){
            throw new IllegalArgumentException("El protocolo no existe");
        }
        if(linkExtremoFisicoRepository.findById(linkProtocoloDeExtremo.getExtremoFisico().getId()).isEmpty()){
            throw new IllegalArgumentException("El extremo fisico no existe");
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
