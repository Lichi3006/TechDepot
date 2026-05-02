package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_CategoriaFuncionItem") @Data
public class LinkCategoriaFuncionItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_CategoriaFuncionItem")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem", nullable = false, foreignKey = @ForeignKey(name = "FK_LinkCategoriaFuncionItem_Item")) private Item item;
    @ManyToOne @JoinColumn(name = "IdREF_CategoriaFuncion", foreignKey = @ForeignKey(name = "FK_LinkCategoriaFuncionItem_CategoriaFuncion")) private RefCategoriaFuncion categoriaFuncion;
}