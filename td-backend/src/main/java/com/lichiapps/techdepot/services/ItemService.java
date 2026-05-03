package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.dtos.ItemDTO;
import com.lichiapps.techdepot.entities.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio principal (fachada) para operaciones con Items.
 * Este servicio ORQUESTA las llamadas a los otros servicios especializados.
 * NO contiene lógica de negocio directa, solo coordina y delega.
 *
 * Patrón: Facade Pattern - Proporciona una interfaz simple para un subsistema complejo.
 */
@Service
public class ItemService {

    // === SERVICIOS ESPECIALIZADOS ===
    @Autowired private ItemValidationService validationService;
    @Autowired private ItemCrudService crudService;
    @Autowired private ItemDetalleService detalleService;
    @Autowired private ItemConexionService conexionService;
    @Autowired private ItemDTOMapperService mapperService;

    /**
     * Crea un Item completo con todos sus detalles.
     * Este método es transaccional: si algo falla, se revierte TODO.
     *
     * @param createDTO DTO con todos los datos del item a crear
     * @return ItemDTO con el item creado y todos sus detalles
     * @throws IllegalArgumentException si faltan datos obligatorios o referencias no existen
     */
    @Transactional
    public ItemDTO createItemConDetalles(ItemCreateDTO createDTO) {
        // 1. Validamos los datos obligatorios
        validationService.validarDatosObligatoriosCreate(createDTO);

        // 2. Creamos el item base (estado, marca, contenedor)
        Item itemGuardado = crudService.crearItemBase(createDTO);

        // 3. Guardamos los colores
        detalleService.guardarColores(itemGuardado, createDTO.getIdsColores());

        // 4. Guardamos las conexiones físicas (puertos y protocolos)
        conexionService.guardarConexiones(itemGuardado, createDTO.getConexiones());

        // 5. Guardamos el detalle de cable (si aplica)
        detalleService.guardarDetalleCable(itemGuardado, createDTO.getDetalleCable());

        // 6. Guardamos el detalle de fuente (si aplica)
        detalleService.guardarDetalleFuente(itemGuardado, createDTO.getDetalleFuente());

        // 7. Guardamos el detalle de hardware (si aplica)
        detalleService.guardarDetalleHardware(itemGuardado, createDTO.getDetalleHardware());

        // 8. Retornamos el ItemDTO completo
        return mapperService.obtenerItemDTOPorId(itemGuardado.getId());
    }

    /**
     * Obtiene todos los items con sus detalles completos.
     * @return Lista de ItemDTO con todos los detalles
     */
    public List<ItemDTO> getAllItemsConDetalles() {
        List<Item> items = crudService.obtenerTodosLosItems();
        return mapperService.convertirListaAItemDTO(items);
    }

    /**
     * Obtiene todos los items (entidades, no DTOs).
     * @return Lista de Items
     */
    public List<Item> getAllItems() {
        return crudService.obtenerTodosLosItems();
    }

    /**
     * Obtiene un item por su ID.
     * @param id ID del item a buscar
     * @return Item encontrado o null
     */
    public Item getItemById(Long id) {
        return crudService.obtenerItemPorId(id);
    }

    /**
     * Elimina un item y TODOS sus detalles relacionados.
     * Este método es transaccional: si algo falla, se revierte TODO.
     *
     * @param id ID del item a eliminar
     */
    @Transactional
    public void deleteItemById(Long id) {
        // Primero eliminamos todos los detalles
        detalleService.eliminarTodosLosDetalles(id);
        conexionService.eliminarConexiones(id);

        // Finalmente eliminamos el item
        crudService.eliminarItem(id);
    }
}