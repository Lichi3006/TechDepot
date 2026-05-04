package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "Color") @Data
public class Color {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdColor")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem", nullable = false) private Item item;
    
    @Column(name = "CodigoHex", nullable = false, length = 7) 
    private String codigoHex;
}