package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_CategoriaFuncionPuerto") @Data
public class LinkCategoriaFuncionPuerto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_CategoriaFuncionPuerto")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdREF_CategoriaFuncion", nullable = false) private RefCategoriaFuncion categoriaFuncion;
    @ManyToOne @JoinColumn(name = "IdREF_Puerto", nullable = false) private RefPuerto puerto;
}