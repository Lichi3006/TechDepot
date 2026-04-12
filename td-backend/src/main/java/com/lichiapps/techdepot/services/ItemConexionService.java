package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio para manejar las conexiones físicas de un Item.
 * Las conexiones son los extremos físicos (puertos) y sus protocolos.
 * Ejemplo: Un cable HDMI tiene 2 conexiones (un extremo macho, otro hembra) con protocolo HDMI 2.0.
 */
@Service
public class ItemConexionService {

    @Autowired private ItemValidationService validationService;
    @Autowired private LinkExtremoFisicoRepository linkExtremoFisicoRepository;
    @Autowired private LinkProtocoloDeExtremoRepository linkProtocoloDeExtremoRepository;

    /**
     * Guarda las conexiones físicas de un Item con sus protocolos.
     * @param item Item al que se le asignarán las conexiones
     * @param conexiones Lista de DTOs con los datos de cada conexión
     */
    public void guardarConexiones(Item item, List<ItemCreateDTO.ConexionCreateDTO> conexiones) {
        if (conexiones == null || conexiones.isEmpty()) {
            return;
        }

        for (ItemCreateDTO.ConexionCreateDTO conexionDTO : conexiones) {
            // Validamos que el puerto exista
            RefPuerto refPuerto = validationService.validarExistePuerto(conexionDTO.getIdPuerto());

            // Creamos el extremo físico (la conexión)
            LinkExtremoFisico linkExtremoFisico = new LinkExtremoFisico();
            linkExtremoFisico.setItem(item);
            linkExtremoFisico.setPuerto(refPuerto);
            linkExtremoFisico.setGenero(conexionDTO.getGenero()); // true = macho, false = hembra

            LinkExtremoFisico extremoGuardado = linkExtremoFisicoRepository.save(linkExtremoFisico);

            // Guardamos los protocolos de esta conexión
            guardarProtocolosDeExtremo(extremoGuardado, conexionDTO.getIdsProtocolos(), conexionDTO.getGenero());
        }
    }

    /**
     * Guarda los protocolos de un extremo físico.
     * Un mismo puerto puede soportar varios protocolos (ej: USB-C puede tener USB 3.0, Thunderbolt, etc.)
     * @param extremo Extremo físico al que se le asignarán los protocolos
     * @param idsProtocolos Lista de IDs de RefProtocolo
     * @param genero Género del extremo (true = macho, false = hembra)
     */
    public void guardarProtocolosDeExtremo(LinkExtremoFisico extremo, List<Long> idsProtocolos, Boolean genero) {
        if (idsProtocolos == null || idsProtocolos.isEmpty()) {
            return;
        }

        for (Long idProtocolo : idsProtocolos) {
            // Validamos que el protocolo exista
            RefProtocolo refProtocolo = validationService.validarExisteProtocolo(idProtocolo);

            // Creamos la relación Extremo-Protocolo
            LinkProtocoloDeExtremo linkProtocolo = new LinkProtocoloDeExtremo();
            linkProtocolo.setExtremoFisico(extremo);
            linkProtocolo.setProtocolo(refProtocolo);
            linkProtocolo.setGenero(genero);

            linkProtocoloDeExtremoRepository.save(linkProtocolo);
        }
    }

    /**
     * Elimina todas las conexiones (extremos físicos y sus protocolos) de un Item.
     * @param idItem ID del item cuyas conexiones se eliminarán
     */
    public void eliminarConexiones(Long idItem) {
        // Buscamos todos los extremos físicos de este item
        List<LinkExtremoFisico> extremos = linkExtremoFisicoRepository.findAll().stream()
                .filter(le -> le.getItem().getId().equals(idItem))
                .toList();

        // Para cada extremo, eliminamos primero sus protocolos
        for (LinkExtremoFisico extremo : extremos) {
            List<LinkProtocoloDeExtremo> protocolos = linkProtocoloDeExtremoRepository.findAll().stream()
                    .filter(lp -> lp.getExtremoFisico().getId().equals(extremo.getId()))
                    .toList();
            linkProtocoloDeExtremoRepository.deleteAll(protocolos);
        }

        // Finalmente eliminamos los extremos
        linkExtremoFisicoRepository.deleteAll(extremos);
    }

    /**
     * Actualiza las conexiones de un Item (elimina las viejas y guarda las nuevas).
     * @param item Item a actualizar
     * @param conexiones Nuevas conexiones
     */
    public void actualizarConexiones(Item item, List<ItemCreateDTO.ConexionCreateDTO> conexiones) {
        eliminarConexiones(item.getId());
        guardarConexiones(item, conexiones);
    }
}