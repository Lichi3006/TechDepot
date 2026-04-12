package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_ExtremoFisico") @Data
public class LinkExtremoFisico {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_ExtremoFisico")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem", nullable = false) private Item item;
    @ManyToOne @JoinColumn(name = "IdREF_Puerto", nullable = false) private RefPuerto puerto;
    @Column(name = "Genero", nullable = false) private Boolean genero;
}