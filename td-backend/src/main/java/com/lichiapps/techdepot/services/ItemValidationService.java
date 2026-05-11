package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio de validación para Items.
 * Se encarga de la lógica de negocio y delega validaciones técnicas.
 */
@Service
public class ItemValidationService {

    @Autowired private ReferenceValidator refValidator;
    @Autowired private ConnectivityValidator connectivityValidator;

    // Inyección dinámica de todos los manejadores de detalles (Patrón Strategy)
    @Autowired private List<com.lichiapps.techdepot.services.handlers.ItemDetalleHandler> detailHandlers;

    /**
     * Valida que los campos obligatorios para crear un Item estén presentes y sean coherentes.
     */
    public void validarDatosObligatoriosCreate(ItemCreateDTO createDTO) {
        List<String> errors = new ArrayList<>();

        if (createDTO.getIdEstado() == null) errors.add("El ID del estado es obligatorio");
        if (createDTO.getIdContenedor() == null) errors.add("El ID del contenedor es obligatorio");

        if (createDTO.getConexiones() == null || createDTO.getConexiones().isEmpty()) {
            errors.add("El item debe tener al menos una conexión");
        } else {
            for (ItemCreateDTO.ConexionCreateDTO con : createDTO.getConexiones()) {
                if (con.getIdPuerto() == null) errors.add("El puerto es obligatorio");
                if (con.getIdCategoriaFuncion() == null) errors.add("La función es obligatoria");
                if (con.getIdExtremo() == null) errors.add("El índice de extremo es obligatorio para la agrupación física");
            }
        }

        // Delegamos validaciones específicas a los handlers (Strategy Pattern)
        detailHandlers.stream()
                .filter(handler -> handler.supports(createDTO))
                .forEach(handler -> handler.validar(createDTO, errors));

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Errores de validación: \n- " + String.join("\n- ", errors));
        }

        // Validación de Conectividad Funcional
        boolean esCable = createDTO.getDetalleCable() != null;
        connectivityValidator.validarConectividad(createDTO.getConexiones(), esCable);
    }

    public RefEstado validarExisteEstado(Long id) { return refValidator.validarEstado(id); }
    public RefMarca validarExisteMarca(Long id) { return refValidator.validarMarca(id); }
    public Contenedor validarExisteContenedor(Long id) { return refValidator.validarContenedor(id); }
    public RefCategoriaFuncion validarExisteCategoriaFuncion(Long id) { return refValidator.validarCategoriaFuncion(id); }
    public RefPuerto validarExistePuerto(Long id) { return refValidator.validarPuerto(id); }
    public RefProtocolo validarExisteProtocolo(Long id) { return refValidator.validarProtocolo(id); }
    public RefBlindajeExternoCable validarExisteBlindajeExterno(Long id) { return refValidator.validarBlindajeExterno(id); }
    public RefBlindajeInternoCable validarExisteBlindajeInterno(Long id) { return refValidator.validarBlindajeInterno(id); }
    public RefCategoriaHardware validarExisteCategoriaHardware(Long id) { return refValidator.validarCategoriaHardware(id); }
}
