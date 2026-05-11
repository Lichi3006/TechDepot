package com.lichiapps.techdepot.services.handlers;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.DetalleFuente;
import com.lichiapps.techdepot.entities.Item;
import com.lichiapps.techdepot.repositories.DetalleFuenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FuenteDetalleHandler implements ItemDetalleHandler {

    @Autowired private DetalleFuenteRepository detalleFuenteRepository;

    @Override
    public boolean supports(ItemCreateDTO dto) {
        return dto.getDetalleFuente() != null;
    }

    @Override
    public void validar(ItemCreateDTO dto, List<String> errors) {
        // No hay validaciones específicas obligatorias por ahora para Fuentes
    }

    @Override
    public void guardar(Item item, ItemCreateDTO dto) {
        ItemCreateDTO.DetalleFuenteCreateDTO fuenteDTO = dto.getDetalleFuente();
        DetalleFuente detalleFuente = new DetalleFuente();
        detalleFuente.setItem(item);
        detalleFuente.setAmperaje(fuenteDTO.getAmperaje());
        detalleFuente.setVoltaje(fuenteDTO.getVoltaje());
        detalleFuenteRepository.save(detalleFuente);
    }

    @Override
    public void actualizar(Item item, ItemCreateDTO dto) {
        eliminar(item.getId());
        guardar(item, dto);
    }

    @Override
    public void eliminar(Long idItem) {
        List<DetalleFuente> fuentes = detalleFuenteRepository.findByItemId(idItem);
        detalleFuenteRepository.deleteAll(fuentes);
    }
}
