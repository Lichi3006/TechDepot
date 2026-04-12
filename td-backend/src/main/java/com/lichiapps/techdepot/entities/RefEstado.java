package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "REF_Estado")
@Data
public class RefEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdREF_Estado")
    private Long id;

    @Column(name = "Nombre", unique = true, nullable = false, length = 20)
    private String nombre;
}