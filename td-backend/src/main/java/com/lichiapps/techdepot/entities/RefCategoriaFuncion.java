package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "REF_CategoriaFuncion") @Data
public class RefCategoriaFuncion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdREF_CategoriaFuncion")
    private Long id;
    @Column(name = "Nombre", unique = true, nullable = false, length = 20) private String nombre;
}