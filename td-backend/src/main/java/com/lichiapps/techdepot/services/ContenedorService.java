package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.Contenedor;
import com.lichiapps.techdepot.entities.RefTipoContenedor;
import com.lichiapps.techdepot.repositories.ContenedorRepository;
import com.lichiapps.techdepot.repositories.RefTipoContenedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lichiapps.techdepot.entities.Item;
import com.lichiapps.techdepot.repositories.ItemRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ContenedorService {

    @Autowired ContenedorRepository contenedorRepository;
    @Autowired RefTipoContenedorRepository tipoContenedorRepository;
    @Autowired ItemRepository itemRepository;
    @Autowired ItemService itemService;
    
    public Contenedor saveContenedor(Contenedor nuevoContenedor){ 
        // ... (existing logic)
        RefTipoContenedor tipo = tipoContenedorRepository.findById(nuevoContenedor.getTipoContenedor().getId())
                .orElseThrow(() -> new IllegalArgumentException("El tipo de contenedor no existe"));

        UUID uuid = UUID.randomUUID();
        String fullUuid = uuid.toString();
        nuevoContenedor.setQrUUID(fullUuid);

        String shortId = fullUuid.substring(fullUuid.length() - 4).toUpperCase();
        long count = contenedorRepository.countByTipoContenedorId(tipo.getId());
        String sequence = String.format("%02d", count + 1);

        nuevoContenedor.setNombre(tipo.getPrefijo() + "-" + sequence + "-" + shortId);
        nuevoContenedor.setTipoContenedor(tipo);

        return contenedorRepository.save(nuevoContenedor);
    }

    @Transactional
    public Contenedor updateContenedor(Long id, Contenedor data) {
        Contenedor existing = contenedorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contenedor no encontrado"));
        
        // Solo permitimos cambiar el tipo (esto regenera el nombre pero mantiene el UUID)
        if (data.getTipoContenedor() != null && !data.getTipoContenedor().getId().equals(existing.getTipoContenedor().getId())) {
            RefTipoContenedor nuevoTipo = tipoContenedorRepository.findById(data.getTipoContenedor().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Tipo de contenedor no válido"));
            
            existing.setTipoContenedor(nuevoTipo);
            
            // Regeneramos el nombre técnico (manteniendo el shortId original del UUID)
            String shortId = existing.getQrUUID().substring(existing.getQrUUID().length() - 4).toUpperCase();
            long count = contenedorRepository.countByTipoContenedorId(nuevoTipo.getId());
            String sequence = String.format("%02d", count + 1);
            existing.setNombre(nuevoTipo.getPrefijo() + "-" + sequence + "-" + shortId);
        }
        
        return contenedorRepository.save(existing);
    }

    @Transactional
    public void deleteContenedorById(Long id){
        // 1. Buscamos todos los items que están dentro de este contenedor
        List<Item> items = itemRepository.findByContenedorId(id);
        
        // 2. Eliminamos cada item usando ItemService (esto limpia colores, conexiones y detalles automáticamente)
        for (Item item : items) {
            itemService.deleteItemById(item.getId());
        }
        
        // 3. Una vez vacío, eliminamos el contenedor
        contenedorRepository.deleteById(id);
    }

    public List<Contenedor> getAllContenedores(){
        return contenedorRepository.findAll();
    }

    public Contenedor getRefContenedorById(Long id){
        return contenedorRepository.findById(id).orElse(null);
    }
}
