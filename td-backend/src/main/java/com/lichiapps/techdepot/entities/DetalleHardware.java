package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "DetalleHardware")
@Data
public class DetalleHardware {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdDetalleHardware")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "IdItem", nullable = false)
    private Item item;

    @Column(name = "ModeloAlfanumerico", length = 100)
    private String modeloAlfanumerico;
}