package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "REF_BlindajeExternoCable") @Data
public class RefBlindajeExternoCable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdREF_BlindajeExternoCable")
    private Long id;
    @Column(name = "Nombre", unique = true, nullable = false, length = 50) private String nombre;
}