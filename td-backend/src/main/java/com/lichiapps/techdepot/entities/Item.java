package com.lichiapps.techdepot.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Item")
@Data
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdItem")
    private Long id;

    @ManyToOne
    @JoinColumn
            (name = "IdREF_Estado", nullable = false, foreignKey = @ForeignKey(name = "FK_Item_RefEstado"))
    private RefEstado estado;

    @ManyToOne
    @JoinColumn(name = "IdREF_Marca", foreignKey = @ForeignKey(name = "FK_Item_RefMarca"))
    private RefMarca marca;

    @ManyToOne
    @JoinColumn(name = "IdContenedor", nullable = false, foreignKey = @ForeignKey(name = "FK_Item_Contenedor"))
    private Contenedor contenedor;
}
