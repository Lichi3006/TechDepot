package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_CategoriaItem") @Data
public class LinkCategoriaItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_CategoriaItem")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdREF_CategoriaItem", nullable = false, foreignKey = @ForeignKey(name = "FK_LinkCategoriaItem_RefCategoriaItem")) private RefCategoriaItem categoriaItem;
    @ManyToOne @JoinColumn(name = "IdItem", nullable = false, foreignKey = @ForeignKey(name = "FK_LinkCategoriaItem_Item")) private Item item;
}