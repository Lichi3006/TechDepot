package com.lichiapps.techdepot.dtos;

import lombok.Data;
import java.util.List;

@Data
public class ItemFilterDTO {
    private List<Long> idsMarcas;
    private List<Long> idsEstados;
    private List<Long> idsContenedores;
    private List<Long> idsPuertos;
    private List<Long> idsCategoriasFuncion;
    private List<Long> idsCategoriasHardware;
    private String query; // Para búsqueda por texto (modelo, marca, etc.)
}
