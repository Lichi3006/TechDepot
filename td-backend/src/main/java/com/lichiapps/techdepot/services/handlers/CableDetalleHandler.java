package com.lichiapps.techdepot.services.handlers;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.DetalleCableRepository;
import com.lichiapps.techdepot.services.DetalleAlimentacionCableService;
import com.lichiapps.techdepot.services.ReferenceValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CableDetalleHandler implements ItemDetalleHandler {

    @Autowired private DetalleCableRepository detalleCableRepository;
    @Autowired private ReferenceValidator referenceValidator;
    @Autowired private DetalleAlimentacionCableService detalleAlimentacionCableService;

    @Override
    public boolean supports(ItemCreateDTO dto) {
        return dto.getDetalleCable() != null;
    }

    @Override
    public void validar(ItemCreateDTO dto, List<String> errors) {
        ItemCreateDTO.DetalleCableCreateDTO cableDTO = dto.getDetalleCable();
        if (cableDTO.getLargo() == null) errors.add("El largo del cable es obligatorio");
        if (cableDTO.getIdBlindajeExterno() == null) errors.add("El blindaje externo es obligatorio");
    }

    @Override
    public void guardar(Item item, ItemCreateDTO dto) {
        ItemCreateDTO.DetalleCableCreateDTO cableDTO = dto.getDetalleCable();
        
        RefBlindajeExternoCable blindajeExterno = referenceValidator.validarBlindajeExterno(cableDTO.getIdBlindajeExterno());
        RefBlindajeInternoCable blindajeInterno = null;
        if (cableDTO.getIdBlindajeInterno() != null) {
            blindajeInterno = referenceValidator.validarBlindajeInterno(cableDTO.getIdBlindajeInterno());
        }

        DetalleCable detalleCable = new DetalleCable();
        detalleCable.setItem(item);
        detalleCable.setLargo(cableDTO.getLargo());
        detalleCable.setBlindajeExterno(blindajeExterno);
        detalleCable.setBlindajeInterno(blindajeInterno);

        DetalleCable cableGuardado = detalleCableRepository.save(detalleCable);

        if (cableDTO.getAmperajeMax() != null) {
            DetalleAlimentacionCable detalleAlimentacion = new DetalleAlimentacionCable();
            detalleAlimentacion.setDetalleCable(cableGuardado);
            detalleAlimentacion.setAmperajeMax(cableDTO.getAmperajeMax());
            detalleAlimentacionCableService.saveDetalleAlimentacionCable(detalleAlimentacion);
        }
    }

    @Override
    public void actualizar(Item item, ItemCreateDTO dto) {
        eliminar(item.getId());
        guardar(item, dto);
    }

    @Override
    public void eliminar(Long idItem) {
        List<DetalleCable> cables = detalleCableRepository.findByItemId(idItem);
        for (DetalleCable cable : cables) {
            detalleAlimentacionCableService.deleteDetalleAlimentacionCableByDetalleCableId(cable.getId());
        }
        detalleCableRepository.deleteAll(cables);
    }
}
