package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemDTO;
import com.lichiapps.techdepot.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Servicio de mapeo para transformar entidades Item a ItemDTO.
 * Recopila todos los datos relacionados de un Item y los convierte a un formato legible para el frontend.
 * Ahora incluye la lógica de inferencia de categoría basada en los extremos físicos.
 */
@Service
public class ItemDTOMapperService {

    @Autowired private ItemCrudService itemCrudService;
    @Autowired private LinkExtremoFisicoService linkExtremoFisicoService;
    @Autowired private LinkProtocoloDeExtremoService linkProtocoloDeExtremoService;
    @Autowired private DetalleCableService detalleCableService;
    @Autowired private DetalleAlimentacionCableService detalleAlimentacionCableService;
    @Autowired private DetalleFuenteService detalleFuenteService;
    @Autowired private DetalleHardwareService detalleHardwareService;
    @Autowired private LinkCategoriaHardwareService linkCategoriaHardwareService;
    @Autowired private ColorService colorService;

    public ItemDTO obtenerItemDTOPorId(Long idItem) {
        Item item = itemCrudService.obtenerItemPorId(idItem);
        if (item == null) return null;

        return convertirAItemDTO(
                item,
                linkExtremoFisicoService.getAllLinkExtremoFisico().stream().filter(l -> l.getItem().getId().equals(idItem)).toList(),
                linkProtocoloDeExtremoService.getAllLinkProtocoloDeExtremo(),
                detalleCableService.getAllDetalleCable().stream().filter(d -> d.getItem().getId().equals(idItem)).toList(),
                detalleHardwareService.getAllDetalleHardware().stream().filter(d -> d.getItem().getId().equals(idItem)).toList(),
                detalleFuenteService.getAllDetalleFuentes().stream().filter(d -> d.getItem().getId().equals(idItem)).toList(),
                colorService.getAllColors().stream().filter(c -> c.getItem().getId().equals(idItem)).toList(),
                detalleAlimentacionCableService.getAllDetalleAlimentacionCable(),
                linkCategoriaHardwareService.getAll()
        );
    }

    public List<ItemDTO> convertirListaAItemDTO(List<Item> items) {
        List<ItemDTO> itemsDTO = new ArrayList<>();

        List<LinkExtremoFisico> linkExtremoFisicos = linkExtremoFisicoService.getAllLinkExtremoFisico();
        List<LinkProtocoloDeExtremo> linkProtocoloDeExtremos = linkProtocoloDeExtremoService.getAllLinkProtocoloDeExtremo();
        List<DetalleCable> detalleCables = detalleCableService.getAllDetalleCable();
        List<DetalleHardware> detalleHardwares = detalleHardwareService.getAllDetalleHardware();
        List<DetalleFuente> detalleFuentes = detalleFuenteService.getAllDetalleFuentes();
        List<Color> colores = colorService.getAllColors();
        List<DetalleAlimentacionCable> alimentaciones = detalleAlimentacionCableService.getAllDetalleAlimentacionCable();
        List<LinkCategoriaHardware> categoriasHardware = linkCategoriaHardwareService.getAll();

        for (Item item : items) {
            itemsDTO.add(convertirAItemDTO(item, linkExtremoFisicos, linkProtocoloDeExtremos, detalleCables, detalleHardwares, detalleFuentes, colores, alimentaciones, categoriasHardware));
        }
        return itemsDTO;
    }

    private ItemDTO convertirAItemDTO(
            Item item,
            List<LinkExtremoFisico> linkExtremoFisicos,
            List<LinkProtocoloDeExtremo> linkProtocoloDeExtremos,
            List<DetalleCable> detalleCables,
            List<DetalleHardware> detalleHardwares,
            List<DetalleFuente> detalleFuentes,
            List<Color> colores,
            List<DetalleAlimentacionCable> alimentaciones,
            List<LinkCategoriaHardware> categoriasHardware
    ) {
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setId(item.getId());
        itemDTO.setEstado(item.getEstado() != null ? item.getEstado().getNombre() : null);
        itemDTO.setMarca(item.getMarca() != null ? item.getMarca().getNombre() : null);
        itemDTO.setContenedor(item.getContenedor() != null ? item.getContenedor().getNombre() : null); // Usamos nombre en vez de UUID para UX

        // === CONEXIONES E INFERENCIA DE CATEGORÍA ===
        List<LinkExtremoFisico> extremosDelItem = linkExtremoFisicos.stream()
                .filter(link -> link.getItem().getId().equals(item.getId()))
                .toList();

        List<ItemDTO.ConexionDTO> conexionesDTO = new ArrayList<>();
        Set<String> funcionesUnicas = extremosDelItem.stream()
                .map(ext -> ext.getCategoriaFuncion().getNombre())
                .collect(Collectors.toSet());
        
        itemDTO.setCategoriaCalculada(String.join(" + ", funcionesUnicas));

        for (LinkExtremoFisico extremo : extremosDelItem) {
            ItemDTO.ConexionDTO conDTO = new ItemDTO.ConexionDTO();
            conDTO.setGenero(extremo.getGenero());
            conDTO.setPuerto(extremo.getPuerto().getNombre());
            conDTO.setCategoriaFuncion(extremo.getCategoriaFuncion().getNombre());

            List<String> protocolos = linkProtocoloDeExtremos.stream()
                    .filter(link -> link.getExtremoFisico().getId().equals(extremo.getId()))
                    .map(link -> link.getProtocolo().getNombre())
                    .toList();
            conDTO.setProtocolo(protocolos);
            conexionesDTO.add(conDTO);
        }
        itemDTO.setConexiones(conexionesDTO);

        // === ESPECIFICACIONES Y DETALLES ===
        ItemDTO.EspecificacionesDTO especDTO = new ItemDTO.EspecificacionesDTO();
        
        // Cable
        detalleCables.stream()
                .filter(d -> d.getItem().getId().equals(item.getId()))
                .findFirst()
                .ifPresent(cable -> {
                    especDTO.setLargo(cable.getLargo());
                    ItemDTO.ProteccionDTO protDTO = new ItemDTO.ProteccionDTO();
                    protDTO.setBlindajeExterno(cable.getBlindajeExterno() != null ? cable.getBlindajeExterno().getNombre() : null);
                    protDTO.setBlindajeInterno(cable.getBlindajeInterno() != null ? cable.getBlindajeInterno().getNombre() : null);
                    itemDTO.setProteccion(protDTO);

                    alimentaciones.stream()
                            .filter(a -> a.getDetalleCable().getId().equals(cable.getId()))
                            .findFirst()
                            .ifPresent(a -> especDTO.setAmperajeMax(a.getAmperajeMax()));
                });

        // Hardware
        detalleHardwares.stream()
                .filter(d -> d.getItem().getId().equals(item.getId()))
                .findFirst()
                .ifPresent(hw -> especDTO.setModelo(hw.getModeloAlfanumerico()));

        // Fuente
        detalleFuentes.stream()
                .filter(d -> d.getItem().getId().equals(item.getId()))
                .findFirst()
                .ifPresent(f -> {
                    especDTO.setVoltaje(f.getVoltaje());
                    especDTO.setAmperaje(f.getAmperaje());
                });

        itemDTO.setEspecificaciones(especDTO);

        // Colores
        List<String> coloresItem = colores.stream()
                .filter(c -> c.getItem().getId().equals(item.getId()))
                .map(Color::getCodigoHex)
                .toList();
        itemDTO.setColor(coloresItem);

        return itemDTO;
    }
}