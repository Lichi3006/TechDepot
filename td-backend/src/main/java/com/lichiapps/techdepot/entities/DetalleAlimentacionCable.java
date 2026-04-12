package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "DetalleAlimentacionCable") @Data
public class DetalleAlimentacionCable {

    @Id @Column(name = "IdDetalleCable")
    private Long id; // Sin GeneratedValue porque usa @MapsId

    @OneToOne @MapsId @JoinColumn(name = "IdDetalleCable")
    private DetalleCable detalleCable;

    @Column(name = "AmperajeMax", nullable = false) private Integer amperajeMax;
}