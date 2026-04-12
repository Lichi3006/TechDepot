package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.Color;
import com.lichiapps.techdepot.repositories.ColorRepository;
import com.lichiapps.techdepot.repositories.ItemRepository;
import com.lichiapps.techdepot.repositories.RefColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ColorService {

    @Autowired private ColorRepository colorRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private RefColorRepository refColorRepository;

    public ColorRepository saveColor(Color color) {
        List<String> errors = new ArrayList<>();
        if(color.getItem() == null){
            errors.add("El item no puede ser nulo");
        }
        if(color.getRefColor() == null){
            errors.add("El refColor no puede ser nulo");
        }
        if(itemRepository.findById(color.getItem().getId()).isPresent()){
            errors.add("El item no existe");
        }
        if(refColorRepository.findById(color.getRefColor().getId()).isPresent()){
            errors.add("El refColor no existe");
        }
        if(!errors.isEmpty()){
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
        return colorRepository;
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
