package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "DetalleAlimentacionCable") @Data
public class DetalleAlimentacionCable {

    @Id @Column(name = "IdDetalleCable")
    private Long id;

    @OneToOne @MapsId @JoinColumn(name = "IdDetalleCable", foreignKey = @ForeignKey(name = "FK_DetalleAlimentacionCable_DetalleCable"))
    private DetalleCable detalleCable;

    @Column(name = "AmperajeMax", nullable = false) private Short amperajeMax;
}