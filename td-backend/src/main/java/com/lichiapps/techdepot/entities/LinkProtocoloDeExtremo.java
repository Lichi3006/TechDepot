package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_ProtocoloDeExtremo") @Data
public class LinkProtocoloDeExtremo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_ProtocoloDeExtremo")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdLINK_ExtremoFisico", nullable = false) private LinkExtremoFisico extremoFisico;
    @ManyToOne @JoinColumn(name = "IdREF_Protocolo", nullable = false) private RefProtocolo protocolo;

    // Le avisamos a Java que la columna IdREF_Puerto ya viene en las otras clases para no chocar
    @ManyToOne @JoinColumn(name = "IdREF_Puerto", insertable = false, updatable = false) private RefPuerto puerto;
    @Column(name = "Genero", nullable = false) private Boolean genero;
}