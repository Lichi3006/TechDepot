package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "REF_Protocolo") @Data
public class RefProtocolo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdREF_Protocolo")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdREF_Puerto", nullable = false) private RefPuerto puerto;
    @ManyToOne @JoinColumn(name = "IdREF_CategoriaFuncion", nullable = false) private RefCategoriaFuncion categoriaFuncion;
    @Column(name = "Nombre", unique = true, nullable = false, length = 50) private String nombre;
}