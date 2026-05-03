package com.lichiapps.techdepot.dtos;

import lombok.Data;
import java.util.List;

@Data
public class ItemDTO {
    private Long id;
    private String marca;      // De RefMarca
    private String estado;     // De RefEstado
    private String contenedor; // El QrUUID de Contenedor
    private List <String> color;      // De Color/RefColor
    private String categoriaCalculada;

    private List<ConexionDTO> conexiones; // De LinkExtremoFisico
    private String tipo;
    private EspecificacionesDTO especificaciones;
    private ProteccionDTO proteccion;

    @Data
    public static class ConexionDTO {
        private String puerto;
        private String categoriaFuncion;
        private List<String> protocolo;
        private boolean genero;
    }

    @Data
    public static class EspecificacionesDTO {
        private Integer largo;
        private Short amperajeMax;
        private Short amperaje;
        private Short voltaje;
        private String modelo;
    }

    @Data
    public static class ProteccionDTO {
        private String blindajeInterno;
        private String blindajeExterno;
    }
}