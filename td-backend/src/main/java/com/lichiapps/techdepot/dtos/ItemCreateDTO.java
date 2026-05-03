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

    // Conexiones físicas
    private List<ConexionCreateDTO> conexiones;

    // Detalles específicos según tipo
    private DetalleCableCreateDTO detalleCable;
    private DetalleFuenteCreateDTO detalleFuente;
    private DetalleHardwareCreateDTO detalleHardware;

    @Data
    public static class ConexionCreateDTO {
        private Long idPuerto;           // ID de RefPuerto
        private Long idCategoriaFuncion; // ID de RefCategoriaFuncion (Energía, Datos, etc.)
        private Boolean genero;          // true=macho, false=hembra
        private List<Long> idsProtocolos; // IDs de RefProtocolo
    }

    @Data
    public static class DetalleCableCreateDTO {
        private Integer largo;
        private Long idBlindajeExterno;        // ID de RefBlindajeExternoCable
        private Long idBlindajeInterno;
        private Short amperajeMax;           // Para cables de alimentación (opcional)
    }

    @Data
    public static class DetalleFuenteCreateDTO {
        private Short amperaje;
        private Short voltaje;
    }

    @Data
    public static class DetalleHardwareCreateDTO {
        private String modeloAlfanumerico;
        private List<Long> idsCategoriasHardware;  // Para LinkCategoriaHardware
    }
}