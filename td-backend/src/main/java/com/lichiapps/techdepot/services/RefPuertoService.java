package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.RefPuerto;
import com.lichiapps.techdepot.repositories.RefPuertoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefPuertoService {


    @Autowired private RefPuertoRepository refPuertoRepository;
    @Autowired private com.lichiapps.techdepot.repositories.LinkExtremoFisicoRepository linkExtremoFisicoRepository;
    @Autowired private com.lichiapps.techdepot.repositories.RefProtocoloRepository refProtocoloRepository;
    @Autowired private com.lichiapps.techdepot.repositories.LinkCategoriaFuncionPuertoRepository linkCategoriaFuncionPuertoRepository;

    public RefPuerto saveRefPuerto(RefPuerto newRefPuerto){

        if(newRefPuerto.getNombre() == null){
            throw new IllegalArgumentException("El nombre del puerto no puede ser nulo");
        }
        if(refPuertoRepository.findByNombre(newRefPuerto.getNombre()).isPresent()){
            throw new IllegalArgumentException("El nombre del puerto ya existe");
        }
        return refPuertoRepository.save(newRefPuerto);
    }
    public RefPuerto getRefPuertoById(Long id){
        return refPuertoRepository.findById(id).orElse(null);
    }
    
    @org.springframework.transaction.annotation.Transactional
    public void deleteRefPuertoById(Long id){
        RefPuerto puerto = getRefPuertoById(id);
        if (puerto == null) {
            throw new IllegalArgumentException("El puerto con el ID especificado no existe.");
        }
        if (linkExtremoFisicoRepository.existsByPuertoId(id)) {
            throw new IllegalArgumentException("No se puede eliminar el puerto '" + puerto.getNombre() + "' porque está asociado a ítems en el inventario.");
        }
        
        List<com.lichiapps.techdepot.entities.RefProtocolo> protocolos = refProtocoloRepository.findByPuertoId(id);
        if (!protocolos.isEmpty()) {
            refProtocoloRepository.deleteAll(protocolos);
        }
        
        List<com.lichiapps.techdepot.entities.LinkCategoriaFuncionPuerto> capacidades = linkCategoriaFuncionPuertoRepository.findByIdIdPuerto(id);
        if (!capacidades.isEmpty()) {
            linkCategoriaFuncionPuertoRepository.deleteAll(capacidades);
        }
        
        refPuertoRepository.deleteById(id);
    }
    public void updateNombreRefPuerto(Long id, String nombre){
        getRefPuertoById(id).setNombre(nombre);
    }
    public List<RefPuerto> getAllRefPuertos(){
        return refPuertoRepository.findAll();
    }
}
