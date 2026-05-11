package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para manejar los detalles comunes de un Item (Colores).
 * Los detalles específicos ahora se manejan mediante el patrón Strategy.
 */
@Service
public class ItemDetalleService {

    @Autowired private ColorRepository colorRepository;

    /**
     * Guarda los colores de un Item.
     */
    public void guardarColores(Item item, List<String> coloresHex) {
        if (coloresHex == null || coloresHex.isEmpty()) {
            return;
        }

        for (String hex : coloresHex) {
            Color color = new Color();
            color.setItem(item);
            color.setCodigoHex(hex);
            colorRepository.save(color);
        }
    }

    /**
     * Elimina todos los colores de un Item.
     */
    @Transactional
    public void eliminarColores(Long idItem) {
        List<Color> colores = colorRepository.findByItemId(idItem);
        colorRepository.deleteAll(colores);
    }

    /**
     * Actualiza los colores de un Item.
     */
    public void actualizarColores(Item item, List<String> coloresHex) {
        eliminarColores(item.getId());
        guardarColores(item, coloresHex);
    }
}
