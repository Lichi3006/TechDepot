package com.lichiapps.techdepot.services.handlers;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import com.lichiapps.techdepot.entities.DetalleHardware;
import com.lichiapps.techdepot.entities.Item;
import com.lichiapps.techdepot.entities.LinkCategoriaHardware;
import com.lichiapps.techdepot.entities.RefCategoriaHardware;
import com.lichiapps.techdepot.repositories.DetalleHardwareRepository;
import com.lichiapps.techdepot.repositories.LinkCategoriaHardwareRepository;
import com.lichiapps.techdepot.services.ReferenceValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HardwareDetalleHandler implements ItemDetalleHandler {

    @Autowired private DetalleHardwareRepository detalleHardwareRepository;
    @Autowired private LinkCategoriaHardwareRepository linkCategoriaHardwareRepository;
    @Autowired private ReferenceValidator referenceValidator;

    @Override
    public boolean supports(ItemCreateDTO dto) {
        return dto.getDetalleHardware() != null;
    }

    @Override
    public void validar(ItemCreateDTO dto, List<String> errors) {
        ItemCreateDTO.DetalleHardwareCreateDTO hardwareDTO = dto.getDetalleHardware();
        if (hardwareDTO.getModeloAlfanumerico() == null || hardwareDTO.getModeloAlfanumerico().isBlank()) {
            errors.add("El modelo alfanumérico es obligatorio");
        }
    }

    @Override
    public void guardar(Item item, ItemCreateDTO dto) {
        ItemCreateDTO.DetalleHardwareCreateDTO hardwareDTO = dto.getDetalleHardware();
        
        DetalleHardware detalleHardware = new DetalleHardware();
        detalleHardware.setItem(item);
        detalleHardware.setModeloAlfanumerico(hardwareDTO.getModeloAlfanumerico());
        DetalleHardware hardwareGuardado = detalleHardwareRepository.save(detalleHardware);

        if (hardwareDTO.getIdsCategoriasHardware() != null) {
            for (Long idCat : hardwareDTO.getIdsCategoriasHardware()) {
                RefCategoriaHardware refCat = referenceValidator.validarCategoriaHardware(idCat);
                LinkCategoriaHardware link = new LinkCategoriaHardware();
                link.setDetalleHardware(hardwareGuardado);
                link.setRefCategoriaHardware(refCat);
                linkCategoriaHardwareRepository.save(link);
            }
        }
    }

    @Override
    public void actualizar(Item item, ItemCreateDTO dto) {
        eliminar(item.getId());
        guardar(item, dto);
    }

    @Override
    public void eliminar(Long idItem) {
        List<DetalleHardware> hardwares = detalleHardwareRepository.findByItemId(idItem);
        for (DetalleHardware hardware : hardwares) {
            List<LinkCategoriaHardware> categoriasHW = linkCategoriaHardwareRepository.findByDetalleHardwareId(hardware.getId());
            linkCategoriaHardwareRepository.deleteAll(categoriasHW);
        }
        detalleHardwareRepository.deleteAll(hardwares);
    }
}
