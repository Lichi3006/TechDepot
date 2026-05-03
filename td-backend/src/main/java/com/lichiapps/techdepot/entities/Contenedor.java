package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity  @Table(name = "Contenedor") @Data public class Contenedor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdContenedor") private Long id;
    @Column(name = "QrUUID", unique = true, nullable = false, length = 36) private String QrUUID;
    @Column(name = "Nombre", length = 100) private String nombre;
}