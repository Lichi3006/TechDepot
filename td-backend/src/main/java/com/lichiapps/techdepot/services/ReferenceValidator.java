package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

/**
 * Validador genérico para verificar la existencia de referencias en la base de datos.
 */
@Component
public class ReferenceValidator {

    @Autowired private RefEstadoRepository refEstadoRepository;
    @Autowired private RefMarcaRepository refMarcaRepository;
    @Autowired private ContenedorRepository contenedorRepository;
    @Autowired private RefColorRepository refColorRepository;
    @Autowired private RefCategoriaFuncionRepository refCategoriaFuncionRepository;
    @Autowired private RefPuertoRepository refPuertoRepository;
    @Autowired private RefProtocoloRepository refProtocoloRepository;
    @Autowired private RefBlindajeExternoCableRepository refBlindajeExternoCableRepository;
    @Autowired private RefBlindajeInternoCableRepository refBlindajeInternoCableRepository;
    @Autowired private RefCategoriaHardwareRepository refCategoriaHardwareRepository;

    public RefEstado validarEstado(Long id) { return validar(refEstadoRepository, id, "Estado"); }
    public RefMarca validarMarca(Long id) { return id == null ? null : validar(refMarcaRepository, id, "Marca"); }
    public Contenedor validarContenedor(Long id) { return validar(contenedorRepository, id, "Contenedor"); }
    public RefCategoriaFuncion validarCategoriaFuncion(Long id) { return validar(refCategoriaFuncionRepository, id, "Categoría de Función"); }
    public RefPuerto validarPuerto(Long id) { return validar(refPuertoRepository, id, "Puerto"); }
    public RefProtocolo validarProtocolo(Long id) { return validar(refProtocoloRepository, id, "Protocolo"); }
    public RefBlindajeExternoCable validarBlindajeExterno(Long id) { return validar(refBlindajeExternoCableRepository, id, "Blindaje Externo"); }
    public RefBlindajeInternoCable validarBlindajeInterno(Long id) { return id == null ? null : validar(refBlindajeInternoCableRepository, id, "Blindaje Interno"); }
    public RefCategoriaHardware validarCategoriaHardware(Long id) { return validar(refCategoriaHardwareRepository, id, "Categoría de Hardware"); }

    private <T, ID> T validar(JpaRepository<T, ID> repo, ID id, String entityName) {
        if (id == null) throw new IllegalArgumentException(entityName + " es obligatorio");
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(entityName + " con ID " + id + " no existe"));
    }
}
