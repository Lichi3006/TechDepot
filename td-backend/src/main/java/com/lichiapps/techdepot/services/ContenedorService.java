package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.Contenedor;
import com.lichiapps.techdepot.entities.RefTipoContenedor;
import com.lichiapps.techdepot.repositories.ContenedorRepository;
import com.lichiapps.techdepot.repositories.RefTipoContenedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ContenedorService {

    @Autowired ContenedorRepository contenedorRepository;
    @Autowired RefTipoContenedorRepository tipoContenedorRepository;
    
    public Contenedor saveContenedor(Contenedor nuevoContenedor){ 
        // 1. Validamos que el tipo de contenedor exista
        RefTipoContenedor tipo = tipoContenedorRepository.findById(nuevoContenedor.getTipoContenedor().getId())
                .orElseThrow(() -> new IllegalArgumentException("El tipo de contenedor no existe"));

        // 2. Generamos el UUID completo
        UUID uuid = UUID.randomUUID();
        String fullUuid = uuid.toString();
        nuevoContenedor.setQrUUID(fullUuid);

        // 3. Obtenemos el sufijo único (últimos 4 caracteres)
        String shortId = fullUuid.substring(fullUuid.length() - 4).toUpperCase();

        // 4. Calculamos el siguiente número secuencial para este TIPO formal
        long count = contenedorRepository.countByTipoContenedorId(tipo.getId());
        String sequence = String.format("%02d", count + 1);

        // 5. Armamos el nombre final usando el prefijo de la tabla maestra: DAT-01-A1B2
        nuevoContenedor.setNombre(tipo.getPrefijo() + "-" + sequence + "-" + shortId);
        nuevoContenedor.setTipoContenedor(tipo);

        return contenedorRepository.save(nuevoContenedor);
    }
    public List<Contenedor> getAllContenedores(){
        return contenedorRepository.findAll();
    }
    public void deleteContenedorById(Long id){
        contenedorRepository.deleteById(id);
    }
    public Contenedor getContenedorById(Long id){
        return contenedorRepository.findById(id).orElse(null);
    }
}
