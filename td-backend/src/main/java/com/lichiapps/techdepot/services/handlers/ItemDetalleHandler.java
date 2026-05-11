package com.lichiapps.techdepot.services.handlers;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.Item;

/**
 * Interfaz para el manejo polimórfico de detalles de Items.
 * Permite que cada tipo de hardware maneje su propia persistencia y limpieza.
 */
public interface ItemDetalleHandler {
    
    /**
     * Determina si este handler debe procesar el ítem según el DTO.
     */
    boolean supports(ItemCreateDTO dto);
    
    /**
     * Valida los datos específicos del detalle y agrega errores a la lista si es necesario.
     */
    void validar(ItemCreateDTO dto, java.util.List<String> errors);
    
    /**
     * Ejecuta la lógica de guardado de detalles específicos.
     */
    void guardar(Item item, ItemCreateDTO dto);

    /**
     * Ejecuta la lógica de actualización de detalles específicos.
     */
    void actualizar(Item item, ItemCreateDTO dto);
    
    /**
     * Ejecuta la lógica de eliminación de detalles específicos.
     */
    void eliminar(Long idItem);
}
