package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_ProtocoloDeExtremo") @Data
public class LinkProtocoloDeExtremo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_ProtocoloDeExtremo")
    private Long id;

    @ManyToOne
    @JoinColumns(value = {
            @JoinColumn(name = "IdLINK_ExtremoFisico", referencedColumnName = "IdLINK_ExtremoFisico"),
            @JoinColumn(name = "IdREF_Puerto", referencedColumnName = "IdREF_Puerto"),
            @JoinColumn(name = "IdREF_CategoriaFuncion", referencedColumnName = "IdREF_CategoriaFuncion")
    }, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private LinkExtremoFisico extremoFisico;

    @ManyToOne
    @JoinColumns(value = {
            @JoinColumn(name = "IdREF_Protocolo", referencedColumnName = "IdREF_Protocolo"),
            @JoinColumn(name = "IdREF_Puerto", referencedColumnName = "IdREF_Puerto", insertable = false, updatable = false),
            @JoinColumn(name = "IdREF_CategoriaFuncion", referencedColumnName = "IdREF_CategoriaFuncion", insertable = false, updatable = false)
    }, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private RefProtocolo protocolo;
}