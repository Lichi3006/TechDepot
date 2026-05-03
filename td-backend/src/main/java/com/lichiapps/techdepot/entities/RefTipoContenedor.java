package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "REF_TipoContenedor") @Data
public class RefTipoContenedor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdREF_TipoContenedor")
    private Long id;

    @Column(name = "Nombre", unique = true, nullable = false, length = 50)
    private String nombre;

    @Column(name = "Prefijo", unique = true, nullable = false, length = 5)
    private String prefijo;
}
