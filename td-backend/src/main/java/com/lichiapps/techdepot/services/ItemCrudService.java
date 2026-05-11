package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lichiapps.techdepot.dtos.ItemFilterDTO;
import com.lichiapps.techdepot.repositories.ItemSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

/**
 * Servicio CRUD para la entidad Item.
 * Maneja las operaciones básicas sobre el Item (crear, actualizar campos básicos, obtener, eliminar).
 * NO maneja los detalles relacionados (colores, conexiones, etc.) - eso lo hace ItemDetalleService.
 */
@Service
public class ItemCrudService {

    @Autowired private ItemRepository itemRepository;
    @Autowired private ItemValidationService validationService;

    /**
     * Obtiene los items que coincidan con los filtros dinámicos.
     */
    public List<Item> obtenerItemsFiltrados(ItemFilterDTO filters) {
        Specification<Item> spec = ItemSpecification.withFilters(filters);
        return itemRepository.findAll(spec);
    }

    /**
     * Crea y guarda un Item base con sus campos principales (estado, marca, contenedor).
     * @param createDTO DTO con los IDs de las referencias
     * @return Item guardado en la BD
     */
    public Item crearItemBase(ItemCreateDTO createDTO) {
        // Validamos y obtenemos las referencias de la BD
        RefEstado estado = validationService.validarExisteEstado(createDTO.getIdEstado());
        RefMarca marca = validationService.validarExisteMarca(createDTO.getIdMarca()); // Puede ser null
        Contenedor contenedor = validationService.validarExisteContenedor(createDTO.getIdContenedor());

        // Creamos el item y le asignamos las referencias
        Item nuevoItem = new Item();
        nuevoItem.setEstado(estado);
        nuevoItem.setMarca(marca);
        nuevoItem.setContenedor(contenedor);

        // Guardamos y retornamos el item con su ID generado
        return itemRepository.save(nuevoItem);
    }

    /**
     * Actualiza el estado de un Item existente.
     * @param item Item a actualizar
     * @param idEstado ID del nuevo estado
     */
    public void actualizarEstado(Item item, Long idEstado) {
        RefEstado estado = validationService.validarExisteEstado(idEstado);
        item.setEstado(estado);
        itemRepository.save(item);
    }

    /**
     * Actualiza la marca de un Item existente.
     * @param item Item a actualizar
     * @param idMarca ID de la nueva marca
     */
    public void actualizarMarca(Item item, Long idMarca) {
        RefMarca marca = validationService.validarExisteMarca(idMarca);
        item.setMarca(marca);
        itemRepository.save(item);
    }

    /**
     * Actualiza el contenedor de un Item existente.
     * @param item Item a actualizar
     * @param idContenedor ID del nuevo contenedor
     */
    public void actualizarContenedor(Item item, Long idContenedor) {
        Contenedor contenedor = validationService.validarExisteContenedor(idContenedor);
        item.setContenedor(contenedor);
        itemRepository.save(item);
    }

    /**
     * Obtiene un Item por su ID.
     * @param id ID del item a buscar
     * @return Item encontrado o null si no existe
     */
    public Item obtenerItemPorId(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    /**
     * Obtiene todos los Items de la BD.
     * @return Lista de todos los items
     */
    public List<Item> obtenerTodosLosItems() {
        return itemRepository.findAll();
    }

    /**
     * Elimina un Item de la BD (solo el item, NO sus detalles).
     * Los detalles deben eliminarse antes usando ItemDetalleService.
     * @param id ID del item a eliminar
     */
    public void eliminarItem(Long id) {
        itemRepository.deleteById(id);
    }
}