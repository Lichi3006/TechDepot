package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio para manejar los detalles de un Item.
 * Guarda, actualiza y elimina: colores, categorías, detalle cable, detalle fuente, detalle hardware.
 * NO maneja conexiones físicas - eso lo hace ItemConexionService.
 */
@Service
public class ItemDetalleService {

    // === SERVICIOS ===
    @Autowired private ItemValidationService validationService;
    @Autowired private DetalleAlimentacionCableService detalleAlimentacionCableService;

    // === REPOSITORIOS ===
    @Autowired private ColorRepository colorRepository;
    @Autowired private DetalleCableRepository detalleCableRepository;
    @Autowired private DetalleFuenteRepository detalleFuenteRepository;
    @Autowired private DetalleHardwareRepository detalleHardwareRepository;
    @Autowired private LinkCategoriaHardwareRepository linkCategoriaHardwareRepository;

    // ==========================================
    // COLORES
    // ==========================================

    /**
     * Guarda los colores de un Item.
     * @param item Item al que se le asignarán los colores
     * @param coloresHex Lista de códigos HEX
     */
    public void guardarColores(Item item, List<String> coloresHex) {
        if (coloresHex == null || coloresHex.isEmpty()) {
            return; // Si no hay colores, no hacemos nada
        }

        for (String hex : coloresHex) {
            // Creamos la relación Item-Color directamente con el HEX
            Color color = new Color();
            color.setItem(item);
            color.setCodigoHex(hex);
            colorRepository.save(color);
        }
    }

    /**
     * Elimina todos los colores de un Item.
     * @param idItem ID del item cuyos colores se eliminarán
     */
    public void eliminarColores(Long idItem) {
        // Buscamos todos los colores que pertenecen a este item usando el repositorio optimizado
        List<Color> colores = colorRepository.findByItemId(idItem);

        // Los eliminamos todos
        colorRepository.deleteAll(colores);
    }

    /**
     * Actualiza los colores de un Item (elimina los viejos y guarda los nuevos).
     * @param item Item a actualizar
     * @param coloresHex Nuevos códigos HEX
     */
    public void actualizarColores(Item item, List<String> coloresHex) {
        eliminarColores(item.getId());
        guardarColores(item, coloresHex);
    }

    // ==========================================
    // DETALLE CABLE
    // ==========================================

    /**
     * Guarda el detalle de cable con todos sus atributos (largo, blindajes, alimentación).
     * @param item Item al que pertenece el cable
     * @param cableDTO DTO con los datos del cable
     */
    public void guardarDetalleCable(Item item, ItemCreateDTO.DetalleCableCreateDTO cableDTO) {
        if (cableDTO == null) {
            return;
        }

        // Validamos y obtenemos el blindaje externo
        RefBlindajeExternoCable blindajeExterno = validationService.validarExisteBlindajeExterno(cableDTO.getIdBlindajeExterno());

        // Validamos y obtenemos el blindaje interno (es opcional)
        RefBlindajeInternoCable blindajeInterno = null;
        if (cableDTO.getIdBlindajeInterno() != null) {
            blindajeInterno = validationService.validarExisteBlindajeInterno(cableDTO.getIdBlindajeInterno());
        }

        // Creamos el detalle del cable directamente
        DetalleCable detalleCable = new DetalleCable();
        detalleCable.setItem(item);
        detalleCable.setLargo(cableDTO.getLargo());
        detalleCable.setBlindajeExterno(blindajeExterno);
        detalleCable.setBlindajeInterno(blindajeInterno); // Lo asignamos directo

        DetalleCable cableGuardado = detalleCableRepository.save(detalleCable);

        // Guardamos el detalle de alimentación si aplica (cables de poder)
        if (cableDTO.getAmperajeMax() != null) {
            DetalleAlimentacionCable detalleAlimentacion = new DetalleAlimentacionCable();
            detalleAlimentacion.setDetalleCable(cableGuardado);
            detalleAlimentacion.setAmperajeMax(cableDTO.getAmperajeMax());
            detalleAlimentacionCableService.saveDetalleAlimentacionCable(detalleAlimentacion);
        }
    }

    /**
     * Elimina el detalle de cable y todas sus relaciones (blindajes internos, alimentación).
     * @param idItem ID del item cuyo detalle de cable se eliminará
     */
    public void eliminarDetalleCable(Long idItem) {
        // Buscamos los cables de este item usando el repositorio optimizado
        List<DetalleCable> cables = detalleCableRepository.findByItemId(idItem);

        for (DetalleCable cable : cables) {
            // Eliminamos detalle de alimentación asociado directamente
            detalleAlimentacionCableService.deleteDetalleAlimentacionCableByDetalleCableId(cable.getId());
        }

        // Finalmente eliminamos los cables
        detalleCableRepository.deleteAll(cables);   
    }

    /**
     * Actualiza el detalle de cable de un Item.
     * @param item Item a actualizar
     * @param cableDTO Nuevos datos del cable
     */
    public void actualizarDetalleCable(Item item, ItemCreateDTO.DetalleCableCreateDTO cableDTO) {
        eliminarDetalleCable(item.getId());
        guardarDetalleCable(item, cableDTO);
    }

    // ==========================================
    // DETALLE FUENTE
    // ==========================================

    /**
     * Guarda el detalle de fuente (amperaje y voltaje).
     * @param item Item al que pertenece la fuente
     * @param fuenteDTO DTO con los datos de la fuente
     */
    public void guardarDetalleFuente(Item item, ItemCreateDTO.DetalleFuenteCreateDTO fuenteDTO) {
        if (fuenteDTO == null) {
            return;
        }

        DetalleFuente detalleFuente = new DetalleFuente();
        detalleFuente.setItem(item);
        detalleFuente.setAmperaje(fuenteDTO.getAmperaje());
        detalleFuente.setVoltaje(fuenteDTO.getVoltaje());
        detalleFuenteRepository.save(detalleFuente);
    }

    /**
     * Elimina el detalle de fuente de un Item.
     * @param idItem ID del item cuyo detalle de fuente se eliminará
     */
    public void eliminarDetalleFuente(Long idItem) {
        List<DetalleFuente> fuentes = detalleFuenteRepository.findByItemId(idItem);

        detalleFuenteRepository.deleteAll(fuentes);
    }

    /**
     * Actualiza el detalle de fuente de un Item.
     * @param item Item a actualizar
     * @param fuenteDTO Nuevos datos de la fuente
     */
    public void actualizarDetalleFuente(Item item, ItemCreateDTO.DetalleFuenteCreateDTO fuenteDTO) {
        eliminarDetalleFuente(item.getId());
        guardarDetalleFuente(item, fuenteDTO);
    }

    // ==========================================
    // DETALLE HARDWARE
    // ==========================================

    /**
     * Guarda el detalle de hardware (modelo y categorías).
     * @param item Item al que pertenece el hardware
     * @param hardwareDTO DTO con los datos del hardware
     */
    public void guardarDetalleHardware(Item item, ItemCreateDTO.DetalleHardwareCreateDTO hardwareDTO) {
        if (hardwareDTO == null) return;

        // 1. Creamos el detalle base
        DetalleHardware detalleHardware = new DetalleHardware();
        detalleHardware.setItem(item);
        detalleHardware.setModeloAlfanumerico(hardwareDTO.getModeloAlfanumerico());

        DetalleHardware hardwareGuardado = detalleHardwareRepository.save(detalleHardware);

        // 2. Guardamos todas las categorías en la tabla puente LINK
        if (hardwareDTO.getIdsCategoriasHardware() != null) {
            for (Long idCat : hardwareDTO.getIdsCategoriasHardware()) {
                RefCategoriaHardware refCat = validationService.validarExisteCategoriaHardware(idCat);

                LinkCategoriaHardware link = new LinkCategoriaHardware();
                link.setDetalleHardware(hardwareGuardado);
                link.setRefCategoriaHardware(refCat);
                linkCategoriaHardwareRepository.save(link);
            }
        }
    }

    /**
     * Elimina el detalle de hardware y sus categorías de un Item.
     * @param idItem ID del item cuyo detalle de hardware se eliminará
     */
    public void eliminarDetalleHardware(Long idItem) {
        List<DetalleHardware> hardwares = detalleHardwareRepository.findByItemId(idItem);

        for (DetalleHardware hardware : hardwares) {
            // Eliminamos categorías asociadas directamente
            List<LinkCategoriaHardware> categoriasHW = linkCategoriaHardwareRepository.findByDetalleHardwareId(hardware.getId());
            linkCategoriaHardwareRepository.deleteAll(categoriasHW);
        }

        // Eliminamos los hardwares
        detalleHardwareRepository.deleteAll(hardwares);
    }

    /**
     * Actualiza el detalle de hardware de un Item.
     * @param item Item a actualizar
     * @param hardwareDTO Nuevos datos del hardware
     */
    public void actualizarDetalleHardware(Item item, ItemCreateDTO.DetalleHardwareCreateDTO hardwareDTO) {
        eliminarDetalleHardware(item.getId());
        guardarDetalleHardware(item, hardwareDTO);
    }

    // ==========================================
    // ELIMINACIÓN GENERAL
    // ==========================================

    /**
     * Elimina TODOS los detalles de un Item (colores, categorías, cable, fuente, hardware).
     * NO elimina las conexiones - eso lo hace ItemConexionService.
     * @param idItem ID del item cuyos detalles se eliminarán
     */
    public void eliminarTodosLosDetalles(Long idItem) {
        eliminarColores(idItem);
        eliminarDetalleCable(idItem);
        eliminarDetalleFuente(idItem);
        eliminarDetalleHardware(idItem);
    }
}
