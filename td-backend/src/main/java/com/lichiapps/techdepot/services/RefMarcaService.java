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

    @Autowired private com.lichiapps.techdepot.repositories.ItemRepository itemRepository;

    public RefMarca getRefMarcaById(Long id){
        return refMarcaRepository.findById(id).orElse(null);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteRefMarcaById(Long id){
        RefMarca marca = getRefMarcaById(id);
        if (marca == null) {
            throw new IllegalArgumentException("La marca con el ID especificado no existe.");
        }
        if (itemRepository.existsByMarcaId(id)) {
            throw new IllegalArgumentException("No se puede eliminar la marca '" + marca.getNombre() + "' porque está asociada a ítems en el inventario.");
        }
        refMarcaRepository.deleteById(id);
    }

    public void updateNombreRefMarca(Long id, String nombre){
        getRefMarcaById(id).setNombre(nombre);
    }
}
