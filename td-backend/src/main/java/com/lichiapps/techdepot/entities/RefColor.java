package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "REF_Color")
@Data
public class RefColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdREF_Color")
    private Long id;

    @Column(name = "CodigoHex", nullable = false, length = 7)
    private String codigoHex;
}