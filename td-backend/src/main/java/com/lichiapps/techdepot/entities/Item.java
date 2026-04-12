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
    @JoinColumn(name = "IdREF_Estado", nullable = false)
    private RefEstado estado;

    @ManyToOne
    @JoinColumn(name = "IdREF_Marca")
    private RefMarca marca;

    @ManyToOne
    @JoinColumn(name = "IdContenedor", nullable = false)
    private Contenedor contenedor;
}
