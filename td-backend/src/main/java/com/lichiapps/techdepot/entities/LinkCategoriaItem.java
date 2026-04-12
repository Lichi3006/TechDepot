package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_CategoriaItem") @Data
public class LinkCategoriaItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_CategoriaItem")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdREF_CategoriaItem", nullable = false) private RefCategoriaItem categoriaItem;
    @ManyToOne @JoinColumn(name = "IdItem", nullable = false) private Item item;
}