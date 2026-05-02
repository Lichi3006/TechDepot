package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "Color") @Data
public class Color {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdColor")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem", foreignKey = @ForeignKey(name = "FK_Color_Item")) private Item item;
    @ManyToOne @JoinColumn(name = "IdREF_Color", nullable = false, foreignKey = @ForeignKey(name = "FK_Color_RefColor")) private RefColor refColor;
}