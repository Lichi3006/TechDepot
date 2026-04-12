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
    private CategoriasDTO categorias; // De LinkCategoriaItem

    private List<ConexionDTO> conexiones; // De LinkExtremoFisico
    private String tipo;
    private EspecificacionesDTO especificaciones;
    private ProteccionDTO proteccion;

    @Data
    public static class ConexionDTO {
        private String puerto;
        private List<String> protocolo;
        private boolean genero;
    }

    @Data
    public static class EspecificacionesDTO {
        private Integer largo;
        private Integer amperajeMax;
        private Integer amperaje;
        private Integer voltaje;
        private String modelo;
    }

    @Data
    public static class CategoriasDTO {
        private List<String> categoriaPuerto;
        private List<String> categoriaItem;  // 'CABLE', 'FUENTE', etc.
        private List<String> categoriaHardware;
    }

    @Data
    public static class ProteccionDTO {
        private String blindajeInterno;
        private String blindajeExterno;
    }
}