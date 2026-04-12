package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "REF_Marca")
@Data
public class RefMarca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdREF_Marca")
    private Long id;

    @Column(name = "Nombre", unique = true, nullable = false, length = 20)
    private String nombre;
}