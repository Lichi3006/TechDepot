package com.lichiapps.techdepot.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "DetalleCable") @Data
public class DetalleCable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "IdDetalleCable")
    private Long id;

    @ManyToOne @JoinColumn(name = "IdItem") private Item item;
    @Column(name = "Largo") private Integer largo;
    @ManyToOne @JoinColumn(name = "IdREF_BlindajeExternoCable") private RefBlindajeExternoCable blindajeExterno;
    @ManyToOne @JoinColumn(name = "IdREF_BlindajeInternoCable") private RefBlindajeInternoCable blindajeInterno;
}