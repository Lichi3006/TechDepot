package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefMarca;
import com.lichiapps.techdepot.repositories.RefMarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class RefMarcaService {

@Autowired private RefMarcaRepository refMarcaRepository;

    public RefMarca saveRefMarca(RefMarca newRefMarca) throws IllegalArgumentException, NullPointerException {
        if (newRefMarca == null) {
            throw new NullPointerException("La marca no puede ser nula");
        }
        if (newRefMarca.getNombre() == null) {
            throw new IllegalArgumentException("La marca debe tener un nombre");
        }
        if (refMarcaRepository.findByNombre(newRefMarca.getNombre()).isPresent()) {
            throw new IllegalArgumentException("El nombre de la marca ya existe");
        }
        return refMarcaRepository.save(newRefMarca);
    }

    public List<RefMarca> getAllRefMarcas(){
        List<RefMarca> marcas = refMarcaRepository.findAll();
        marcas.sort(Comparator.comparing(RefMarca::getNombre)); // se ordena de forma ascendente por nombre
        return marcas;
    }

    public RefMarca getRefMarcaById(Long id){
        return refMarcaRepository.findById(id).orElse(null);
    }

    public void deleteRefMarcaById(Long id){
        refMarcaRepository.deleteById(id);
    }

    public void updateNombreRefMarca(Long id, String nombre){
        getRefMarcaById(id).setNombre(nombre);
    }
}
