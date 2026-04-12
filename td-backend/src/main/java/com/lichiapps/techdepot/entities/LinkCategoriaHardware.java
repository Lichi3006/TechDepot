package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "LINK_CategoriaHardware")
@Data
public class LinkCategoriaHardware {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdLINK_CategoriaHardware")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "IdDetalleHardware", nullable = false)
    private DetalleHardware detalleHardware;

    @ManyToOne
    @JoinColumn(name = "IdREF_CategoriaHardware", nullable = false)
    private RefCategoriaHardware refCategoriaHardware;
}