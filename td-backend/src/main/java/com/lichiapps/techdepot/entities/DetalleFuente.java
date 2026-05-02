package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "DetalleFuente") @Data
public class DetalleFuente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdDetalleFuente")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem", foreignKey = @ForeignKey(name = "FK_DetalleFuente_Item")) private Item item;
    @Column(name = "Amperaje", nullable = false) private Short amperaje;
    @Column(name = "Voltaje", nullable = false) private Short voltaje;
}