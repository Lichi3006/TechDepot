package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "DetalleFuente") @Data
public class DetalleFuente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdDetalleFuente")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem") private Item item;
    @Column(name = "Amperaje", nullable = false) private Integer amperaje;
    @Column(name = "Voltaje", nullable = false) private Integer voltaje;
}