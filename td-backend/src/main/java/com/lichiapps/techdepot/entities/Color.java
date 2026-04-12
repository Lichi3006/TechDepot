package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "Color") @Data
public class Color {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdColor")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem") private Item item;
    @ManyToOne @JoinColumn(name = "IdREF_Color", nullable = false) private RefColor refColor;
}