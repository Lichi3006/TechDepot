package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio de validación para Items.
 * Se encarga de verificar que los datos sean correctos y que las referencias existan en la BD.
 * Lanza excepciones descriptivas cuando algo falla.
 */
@Service
public class ItemValidationService {

    // === REPOSITORIOS NECESARIOS PARA VALIDAR ===
    @Autowired private ItemRepository itemRepository;
    @Autowired private RefEstadoRepository refEstadoRepository;
    @Autowired private RefMarcaRepository refMarcaRepository;
    @Autowired private ContenedorRepository contenedorRepository;
    @Autowired private RefColorRepository refColorRepository;
    @Autowired private RefCategoriaItemRepository refCategoriaItemRepository;
    @Autowired private RefPuertoRepository refPuertoRepository;
    @Autowired private RefProtocoloRepository refProtocoloRepository;
    @Autowired private RefBlindajeExternoCableRepository refBlindajeExternoCableRepository;
    @Autowired private RefBlindajeInternoCableRepository refBlindajeInternoCableRepository;
    @Autowired private RefCategoriaHardwareRepository refCategoriaHardwareRepository;

    /**
     * Valida que los campos obligatorios para crear un Item estén presentes.
     * @param createDTO DTO con los datos del item a crear
     * @throws IllegalArgumentException si faltan campos obligatorios
     */
    public void validarDatosObligatoriosCreate(ItemCreateDTO createDTO) {
        List<String> errors = new ArrayList<>();

        // Verificamos campos que NO pueden ser nulos
        if (createDTO.getIdEstado() == null) {
            errors.add("El ID del estado es obligatorio");
        }
        if (createDTO.getIdContenedor() == null) {
            errors.add("El ID del contenedor es obligatorio");
        }

        // Si hay errores, los juntamos y lanzamos excepción
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Error/es: \n" + String.join("\n", errors));
        }
    }

    /**
     * Valida que un Item exista en la BD y lo retorna.
     * @param id ID del item a buscar
     * @return Item encontrado
     * @throws IllegalArgumentException si el item no existe
     */
    public Item validarExisteItem(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El item con ID " + id + " no existe"));
    }

    /**
     * Valida que un Estado exista en la BD y lo retorna.
     * @param id ID del estado a buscar
     * @return RefEstado encontrado
     * @throws IllegalArgumentException si el estado no existe
     */
    public RefEstado validarExisteEstado(Long id) {
        return refEstadoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El estado con ID " + id + " no existe"));
    }

    /**
     * Valida que una Marca exista en la BD y la retorna.
     * @param id ID de la marca a buscar (puede ser null)
     * @return RefMarca encontrada o null si el id es null
     * @throws IllegalArgumentException si la marca no existe
     */
    public RefMarca validarExisteMarca(Long id) {
        // La marca es opcional, si viene null retornamos null
        if (id == null) {
            return null;
        }
        return refMarcaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La marca con ID " + id + " no existe"));
    }

    /**
     * Valida que un Contenedor exista en la BD y lo retorna.
     * @param id ID del contenedor a buscar
     * @return Contenedor encontrado
     * @throws IllegalArgumentException si el contenedor no existe
     */
    public Contenedor validarExisteContenedor(Long id) {
        return contenedorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El contenedor con ID " + id + " no existe"));
    }

    /**
     * Valida que un Color exista en la BD y lo retorna.
     * @param id ID del color a buscar
     * @return RefColor encontrado
     * @throws IllegalArgumentException si el color no existe
     */
    public RefColor validarExisteColor(Long id) {
        return refColorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El color con ID " + id + " no existe"));
    }

    /**
     * Valida que una CategoriaItem exista en la BD y la retorna.
     * @param id ID de la categoría a buscar
     * @return RefCategoriaItem encontrada
     * @throws IllegalArgumentException si la categoría no existe
     */
    public RefCategoriaItem validarExisteCategoriaItem(Long id) {
        return refCategoriaItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La categoría de item con ID " + id + " no existe"));
    }

    /**
     * Valida que un Puerto exista en la BD y lo retorna.
     * @param id ID del puerto a buscar
     * @return RefPuerto encontrado
     * @throws IllegalArgumentException si el puerto no existe
     */
    public RefPuerto validarExistePuerto(Long id) {
        return refPuertoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El puerto con ID " + id + " no existe"));
    }

    /**
     * Valida que un Protocolo exista en la BD y lo retorna.
     * @param id ID del protocolo a buscar
     * @return RefProtocolo encontrado
     * @throws IllegalArgumentException si el protocolo no existe
     */
    public RefProtocolo validarExisteProtocolo(Long id) {
        return refProtocoloRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El protocolo con ID " + id + " no existe"));
    }

    /**
     * Valida que un BlindajeExterno exista en la BD y lo retorna.
     * @param id ID del blindaje externo a buscar
     * @return RefBlindajeExternoCable encontrado
     * @throws IllegalArgumentException si el blindaje no existe
     */
    public RefBlindajeExternoCable validarExisteBlindajeExterno(Long id) {
        return refBlindajeExternoCableRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El blindaje externo con ID " + id + " no existe"));
    }

    /**
     * Valida que un BlindajeInterno exista en la BD y lo retorna.
     * @param id ID del blindaje interno a buscar
     * @return RefBlindajeInternoCable encontrado
     * @throws IllegalArgumentException si el blindaje no existe
     */
    public RefBlindajeInternoCable validarExisteBlindajeInterno(Long id) {
        return refBlindajeInternoCableRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El blindaje interno con ID " + id + " no existe"));
    }

    /**
     * Valida que una CategoriaHardware exista en la BD y la retorna.
     * @param id ID de la categoría a buscar
     * @return RefCategoriaHardware encontrada
     * @throws IllegalArgumentException si la categoría no existe
     */
    public RefCategoriaHardware validarExisteCategoriaHardware(Long id) {
        return refCategoriaHardwareRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La categoría de hardware con ID " + id + " no existe"));
    }
}