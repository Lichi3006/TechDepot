package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "LINK_ProtocoloDeExtremo") @Data
public class LinkProtocoloDeExtremo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdLINK_ProtocoloDeExtremo")
    private Long id;

    // Quitamos las declaraciones manuales de foreignKey para que Hibernate no intente sobreescribir el SQL original
    @ManyToOne
    @JoinColumn(name = "IdLINK_ExtremoFisico", nullable = false)
    private LinkExtremoFisico extremoFisico;

    @ManyToOne
    @JoinColumn(name = "IdREF_Protocolo", nullable = false)
    private RefProtocolo protocolo;

    // Mantenemos el insertable=false para no chocar, pero sin obligar a crear la FK simple
    @ManyToOne
    @JoinColumn(
            name = "IdREF_Puerto",
            insertable = false,
            updatable = false,
            foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT) // <--- Sin constraint creada por hibernate
    )
    private RefPuerto puerto;

    @Column(name = "Genero", nullable = false)
    private Boolean genero;
}