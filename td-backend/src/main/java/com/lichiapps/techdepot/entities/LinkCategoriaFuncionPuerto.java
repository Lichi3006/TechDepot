package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Entity
@Table(name = "LINK_CategoriaFuncionPuerto")
@Data
public class LinkCategoriaFuncionPuerto {

    @EmbeddedId
    private LinkCategoriaFuncionPuertoId id;

    @ManyToOne
    @MapsId("idPuerto")
    @JoinColumn(name = "IdREF_Puerto")
    private RefPuerto puerto;

    @ManyToOne
    @MapsId("idCategoriaFuncion")
    @JoinColumn(name = "IdREF_CategoriaFuncion")
    private RefCategoriaFuncion categoriaFuncion;

    @Embeddable
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LinkCategoriaFuncionPuertoId implements Serializable {
        @Column(name = "IdREF_Puerto")
        private Long idPuerto;

        @Column(name = "IdREF_CategoriaFuncion")
        private Long idCategoriaFuncion;
    }
}
