package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "REF_CategoriaHardware") @Data
public class RefCategoriaHardware {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdREF_CategoriaHardware")
    private Long id;
    @Column(name = "Nombre", unique = true, nullable = false, length = 50) private String nombre;
}