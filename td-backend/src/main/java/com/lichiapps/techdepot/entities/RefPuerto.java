package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "REF_Puerto") @Data
public class RefPuerto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdREF_Puerto")
    private Long id;
    @Column(name = "Nombre", unique = true, nullable = false, length = 50) private String nombre;
}