package com.lichiapps.techdepot.dtos;

import lombok.Data;
import java.util.List;

@Data
public class ItemCreateDTO {
    // Datos básicos del Item (IDs de referencias)
    private Long idEstado;           // ID de RefEstado
    private Long idMarca;            // ID de RefMarca (puede ser null)
    private Long idContenedor;       // ID de Contenedor existente

    private List<Long> idsColores;   // IDs de RefColor

    // Categorías del item
    private List<Long> idsCategoriasItem; // IDs de RefCategoriaItem (ej: CABLE, FUENTE)

    // Conexiones físicas
    private List<ConexionCreateDTO> conexiones;

    // Detalles específicos según tipo
    private DetalleCableCreateDTO detalleCable;
    private DetalleFuenteCreateDTO detalleFuente;
    private DetalleHardwareCreateDTO detalleHardware;

    @Data
    public static class ConexionCreateDTO {
        private Long idPuerto;           // ID de RefPuerto
        private Boolean genero;          // true=macho, false=hembra
        private List<Long> idsProtocolos; // IDs de RefProtocolo
    }

    @Data
    public static class DetalleCableCreateDTO {
        private Integer largo;
        private Long idBlindajeExterno;        // ID de RefBlindajeExternoCable
        private Long idBlindajeInterno;
        private Integer amperajeMax;           // Para cables de alimentación (opcional)
    }

    @Data
    public static class DetalleFuenteCreateDTO {
        private Integer amperaje;
        private Integer voltaje;
    }

    @Data
    public static class DetalleHardwareCreateDTO {
        private String modeloAlfanumerico;
        private Long idCategoriaHardwarePrincipal; // Para DetalleHardware
        private List<Long> idsCategoriasHardware;  // Para LinkCategoriaHardware
    }
}