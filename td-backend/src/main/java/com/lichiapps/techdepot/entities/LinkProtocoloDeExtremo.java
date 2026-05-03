package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_ProtocoloDeExtremo") @Data
public class LinkProtocoloDeExtremo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_ProtocoloDeExtremo")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "IdLINK_ExtremoFisico", nullable = false, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private LinkExtremoFisico extremoFisico;

    @ManyToOne
    @JoinColumn(name = "IdREF_Protocolo", nullable = false, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private RefProtocolo protocolo;

    // Campos redundantes obligatorios para satisfacer la FK compuesta en SQL Server
    @Column(name = "IdREF_Puerto", nullable = false)
    private Long idPuerto;

    @Column(name = "IdREF_CategoriaFuncion", nullable = false)
    private Long idCategoriaFuncion;
}