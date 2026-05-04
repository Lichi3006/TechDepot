package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.Color;
import com.lichiapps.techdepot.repositories.ColorRepository;
import com.lichiapps.techdepot.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColorService {

    @Autowired private ColorRepository colorRepository;
    @Autowired private ItemRepository itemRepository;

    public Color saveColor(Color color) {
        if(color.getItem() == null){
            throw new IllegalArgumentException("El item no puede ser nulo");
        }
        if(color.getCodigoHex() == null || color.getCodigoHex().isBlank()){
            throw new IllegalArgumentException("El codigo hex no puede ser nulo o vacio");
        }
        if(itemRepository.findById(color.getItem().getId()).isEmpty()){
            throw new IllegalArgumentException("El item no existe");
        }
        return colorRepository.save(color);
    }

    public List<Color> getAllColors(){
        return colorRepository.findAll();
    }

    public Color getColorById(Long id){
        return colorRepository.findById(id).orElse(null);
    }

    public void deleteColorById(Long id){
        colorRepository.deleteById(id);
    }
}
