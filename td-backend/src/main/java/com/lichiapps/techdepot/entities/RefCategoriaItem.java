package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "REF_CategoriaItem") @Data
public class RefCategoriaItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdREF_CategoriaItem")
    private Long id;
    @Column(name = "Nombre", unique = true, nullable = false, length = 36) private String nombre;
}