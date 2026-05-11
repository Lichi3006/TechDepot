package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.dtos.ItemDTO;
import com.lichiapps.techdepot.entities.Item;
import com.lichiapps.techdepot.services.handlers.ItemDetalleHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lichiapps.techdepot.dtos.ItemFilterDTO;

import java.util.List;

/**
 * Servicio principal (fachada) para operaciones con Items.
 * Este servicio ORQUESTA las llamadas a los otros servicios especializados.
 * NO contiene lógica de negocio directa, solo coordina y delega.
 */
@Service
public class ItemService {

    @Autowired private ItemValidationService validationService;
    @Autowired private ItemCrudService crudService;
    @Autowired private ItemDetalleService detalleService;
    @Autowired private ItemConexionService conexionService;
    @Autowired private ItemDTOMapperService mapperService;

    // Inyección dinámica de todos los manejadores de detalles (Patrón Strategy)
    @Autowired private List<ItemDetalleHandler> detailHandlers;

    /**
     * Búsqueda avanzada de items con filtros dinámicos.
     */
    public List<ItemDTO> searchItems(ItemFilterDTO filters) {
        List<Item> items = crudService.obtenerItemsFiltrados(filters);
        return mapperService.convertirListaAItemDTO(items);
    }

    @Transactional
    public ItemDTO createItemConDetalles(ItemCreateDTO createDTO) {
        // 1. Validamos los datos obligatorios
        validationService.validarDatosObligatoriosCreate(createDTO);

        // 2. Creamos el item base (estado, marca, contenedor)
        Item itemGuardado = crudService.crearItemBase(createDTO);

        // 3. Guardamos los colores
        detalleService.guardarColores(itemGuardado, createDTO.getColoresHex());

        // 4. Guardamos las conexiones físicas (puertos y protocolos)
        conexionService.guardarConexiones(itemGuardado, createDTO.getConexiones());

        // 5. Guardamos detalles específicos mediante handlers polimórficos
        detailHandlers.stream()
                .filter(handler -> handler.supports(createDTO))
                .forEach(handler -> handler.guardar(itemGuardado, createDTO));

        // 6. Retornamos el ItemDTO completo
        return mapperService.obtenerItemDTOPorId(itemGuardado.getId());
    }

    @Transactional
    public ItemDTO updateItemConDetalles(Long id, ItemCreateDTO updateDTO) {
        // 1. Buscamos el item existente
        Item itemExistente = crudService.obtenerItemPorId(id);
        if (itemExistente == null) {
            throw new IllegalArgumentException("No se encontró el Item con ID: " + id);
        }

        // 2. Validamos los nuevos datos
        validationService.validarDatosObligatoriosCreate(updateDTO);

        // 3. Actualizamos campos básicos
        crudService.actualizarEstado(itemExistente, updateDTO.getIdEstado());
        crudService.actualizarMarca(itemExistente, updateDTO.getIdMarca());
        crudService.actualizarContenedor(itemExistente, updateDTO.getIdContenedor());

        // 4. Actualizamos colores
        detalleService.actualizarColores(itemExistente, updateDTO.getColoresHex());

        // 5. Actualizamos conexiones
        conexionService.actualizarConexiones(itemExistente, updateDTO.getConexiones());

        // 6. Actualizamos detalles específicos mediante handlers (Strategy)
        detailHandlers.stream()
                .filter(handler -> handler.supports(updateDTO))
                .forEach(handler -> handler.actualizar(itemExistente, updateDTO));

        // 7. Retornamos el DTO actualizado
        return mapperService.obtenerItemDTOPorId(id);
    }

    public List<ItemDTO> getAllItemsConDetalles() {
        List<Item> items = crudService.obtenerTodosLosItems();
        return mapperService.convertirListaAItemDTO(items);
    }

    public List<Item> getAllItems() {
        return crudService.obtenerTodosLosItems();
    }

    public Item getItemById(Long id) {
        return crudService.obtenerItemPorId(id);
    }

    @Transactional
    public void deleteItemById(Long id) {
        // Eliminamos todos los detalles usando los handlers
        detailHandlers.forEach(handler -> handler.eliminar(id));
        
        // Limpiamos colores y conexiones
        detalleService.eliminarColores(id);
        conexionService.eliminarConexiones(id);

        // Finalmente eliminamos el item base
        crudService.eliminarItem(id);
    }
}