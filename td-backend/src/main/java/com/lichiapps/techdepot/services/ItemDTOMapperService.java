package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemDTO;
import com.lichiapps.techdepot.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio de mapeo para transformar entidades Item a ItemDTO.
 * Recopila todos los datos relacionados de un Item y los convierte a un formato legible para el frontend.
 * Optimizada para no repetir llamadas a la base de datos dentro de bucles.
 */
@Service
public class ItemDTOMapperService {

    // === SERVICIOS PARA OBTENER DATOS RELACIONADOS ===
    @Autowired private ItemCrudService itemCrudService;
    @Autowired private LinkExtremoFisicoService linkExtremoFisicoService;
    @Autowired private LinkProtocoloDeExtremoService linkProtocoloDeExtremoService;
    @Autowired private LinkCategoriaFuncionPuertoService linkCategoriaFuncionPuertoService;
    @Autowired private DetalleCableService detalleCableService;
    @Autowired private DetalleAlimentacionCableService detalleAlimentacionCableService;
    @Autowired private LinkCategoriaItemService linkCategoriaItemService;
    @Autowired private DetalleFuenteService detalleFuenteService;
    @Autowired private DetalleHardwareService detalleHardwareService;
    @Autowired private LinkCategoriaHardwareService linkCategoriaHardwareService;
    @Autowired private ColorService colorService;

    public ItemDTO obtenerItemDTOPorId(Long idItem) {
        return convertirListaAItemDTO(itemCrudService.obtenerTodosLosItems()).stream()
                .filter(dto -> dto.getId().equals(idItem))
                .findFirst()
                .orElse(null);
    }

    public List<ItemDTO> convertirListaAItemDTO(List<Item> items) {
        List<ItemDTO> itemsDTO = new ArrayList<>();

        // Cargamos TODAS las entidades relacionadas una sola vez (evita N+1 queries)
        List<LinkExtremoFisico> linkExtremoFisicos = linkExtremoFisicoService.getAllLinkExtremoFisico();
        List<LinkProtocoloDeExtremo> linkProtocoloDeExtremos = linkProtocoloDeExtremoService.getAllLinkProtocoloDeExtremo();
        List<LinkCategoriaFuncionPuerto> linkCategoriaFuncionPuertos = linkCategoriaFuncionPuertoService.getAllLinkCategoriaFuncionPuerto();
        List<DetalleCable> detalleCables = detalleCableService.getAllDetalleCable();
        List<DetalleHardware> detalleHardwares = detalleHardwareService.getAllDetalleHardware();
        List<LinkCategoriaItem> linkCategoriasItems = linkCategoriaItemService.getAllLinkCategoriaItem();
        List<DetalleFuente> detalleFuentes = detalleFuenteService.getAllDetalleFuentes();
        List<Color> colores = colorService.getAllColors();

        // --- MOVIDAS ARRIBA PARA OPTIMIZAR (Antes estaban en el for) ---
        List<DetalleAlimentacionCable> alimentaciones = detalleAlimentacionCableService.getAllDetalleAlimentacionCable();
        List<LinkCategoriaHardware> categoriasHardware = linkCategoriaHardwareService.getAll();

        // Convertimos cada item
        for (Item item : items) {
            ItemDTO itemDTO = convertirAItemDTO(
                    item,
                    linkExtremoFisicos,
                    linkProtocoloDeExtremos,
                    linkCategoriaFuncionPuertos,
                    detalleCables,
                    detalleHardwares,
                    linkCategoriasItems,
                    detalleFuentes,
                    colores,
                    alimentaciones,    // <--- Pasamos la lista completa
                    categoriasHardware // <--- Pasamos la lista completa
            );
            itemsDTO.add(itemDTO);
        }

        return itemsDTO;
    }

    private ItemDTO convertirAItemDTO(
            Item item,
            List<LinkExtremoFisico> linkExtremoFisicos,
            List<LinkProtocoloDeExtremo> linkProtocoloDeExtremos,
            List<LinkCategoriaFuncionPuerto> linkCategoriaFuncionPuertos,
            List<DetalleCable> detalleCables,
            List<DetalleHardware> detalleHardwares,
            List<LinkCategoriaItem> linkCategoriasItems,
            List<DetalleFuente> detalleFuentes,
            List<Color> colores,
            List<DetalleAlimentacionCable> alimentaciones,
            List<LinkCategoriaHardware> categoriasHardware
    ) {
        // Inicializamos las estructuras del DTO
        List<ItemDTO.ConexionDTO> conexionesDTO = new ArrayList<>();
        ItemDTO.EspecificacionesDTO especificacionesDTO = new ItemDTO.EspecificacionesDTO();
        ItemDTO.CategoriasDTO categoriasDTO = new ItemDTO.CategoriasDTO();
        List<String> categoriasFuncionPuerto = new ArrayList<>();
        List<String> categoriasItem = new ArrayList<>();
        List<String> coloresItem = new ArrayList<>();

        // === DATOS BÁSICOS DEL ITEM ===
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setId(item.getId());
        itemDTO.setEstado(item.getEstado() != null ? item.getEstado().getNombre() : null);
        itemDTO.setMarca(item.getMarca() != null ? item.getMarca().getNombre() : null);
        itemDTO.setContenedor(item.getContenedor() != null ? item.getContenedor().getQrUUID() : null);

        // === CONEXIONES FÍSICAS ===
        List<LinkExtremoFisico> extremosDelItem = linkExtremoFisicos.stream()
                .filter(link -> link.getItem().getId().equals(item.getId()))
                .toList();

        if (!extremosDelItem.isEmpty()) {
            for (LinkExtremoFisico extremo : extremosDelItem) {
                ItemDTO.ConexionDTO conexionDTO = new ItemDTO.ConexionDTO();
                conexionDTO.setGenero(extremo.getGenero());
                conexionDTO.setPuerto(extremo.getPuerto().getNombre());

                List<LinkCategoriaFuncionPuerto> categoriasPuerto = linkCategoriaFuncionPuertos.stream()
                        .filter(link -> link.getPuerto().getId().equals(extremo.getPuerto().getId()))
                        .toList();
                for (LinkCategoriaFuncionPuerto catPuerto : categoriasPuerto) {
                    categoriasFuncionPuerto.add(catPuerto.getCategoriaFuncion().getNombre());
                }

                List<LinkProtocoloDeExtremo> protocolosDelExtremo = linkProtocoloDeExtremos.stream()
                        .filter(link -> link.getExtremoFisico().getId().equals(extremo.getId()))
                        .toList();
                if (!protocolosDelExtremo.isEmpty()) {
                    List<String> protocolos = new ArrayList<>();
                    for (LinkProtocoloDeExtremo protocolo : protocolosDelExtremo) {
                        protocolos.add(protocolo.getProtocolo().getNombre());
                    }
                    conexionDTO.setProtocolo(protocolos);
                }

                conexionesDTO.add(conexionDTO);
            }
            itemDTO.setConexiones(conexionesDTO);
        }
        categoriasDTO.setCategoriaPuerto(categoriasFuncionPuerto);

        // === DETALLE CABLE ===
        DetalleCable detalleCable = detalleCables.stream()
                .filter(detalle -> detalle.getItem().getId().equals(item.getId()))
                .findFirst()
                .orElse(null);

        if (detalleCable != null) {
            especificacionesDTO.setLargo(detalleCable.getLargo());

            ItemDTO.ProteccionDTO proteccion = new ItemDTO.ProteccionDTO();
            proteccion.setBlindajeExterno(detalleCable.getBlindajeExterno() != null ? detalleCable.getBlindajeExterno().getNombre() : null);

            // Usamos la nueva relación directa del blindaje interno
            proteccion.setBlindajeInterno(detalleCable.getBlindajeInterno() != null ? detalleCable.getBlindajeInterno().getNombre() : null);

            // Detalle de alimentación - AHORA USA LA LISTA PASADA POR PARÁMETRO
            DetalleAlimentacionCable alimentacion = alimentaciones.stream()
                    .filter(da -> da.getDetalleCable().getId().equals(detalleCable.getId()))
                    .findFirst()
                    .orElse(null);
            if (alimentacion != null) {
                especificacionesDTO.setAmperajeMax(alimentacion.getAmperajeMax());
            }

            itemDTO.setProteccion(proteccion);
        }

        // === DETALLE HARDWARE ===
        DetalleHardware detalleHardware = detalleHardwares.stream()
                .filter(detalle -> detalle.getItem().getId().equals(item.getId()))
                .findFirst()
                .orElse(null);

        if (detalleHardware != null) {
            especificacionesDTO.setModelo(detalleHardware.getModeloAlfanumerico());

            // Categorías del hardware - AHORA USA LA LISTA PASADA POR PARÁMETRO
            List<String> catsHard = categoriasHardware.stream()
                    .filter(l -> l.getDetalleHardware().getId().equals(detalleHardware.getId()))
                    .map(l -> l.getRefCategoriaHardware().getNombre())
                    .toList();
            categoriasDTO.setCategoriaHardware(catsHard);
        }

        // === CATEGORÍAS DEL ITEM ===
        List<LinkCategoriaItem> categoriasDelItem = linkCategoriasItems.stream()
                .filter(link -> link.getItem().getId().equals(item.getId()))
                .toList();
        if (!categoriasDelItem.isEmpty()) {
            for (LinkCategoriaItem cat : categoriasDelItem) {
                categoriasItem.add(cat.getCategoriaItem().getNombre());
            }
            categoriasDTO.setCategoriaItem(categoriasItem);
        }
        itemDTO.setCategorias(categoriasDTO);

        // === DETALLE FUENTE ===
        DetalleFuente detalleFuente = detalleFuentes.stream()
                .filter(detalle -> detalle.getItem().getId().equals(item.getId()))
                .findFirst()
                .orElse(null);
        if (detalleFuente != null) {
            especificacionesDTO.setVoltaje(detalleFuente.getVoltaje());
            especificacionesDTO.setAmperaje(detalleFuente.getAmperaje());
        }
        itemDTO.setEspecificaciones(especificacionesDTO);

        // === COLORES ===
        List<Color> coloresDelItem = colores.stream()
                .filter(color -> color.getItem().getId().equals(item.getId()))
                .toList();
        if (!coloresDelItem.isEmpty()) {
            for (Color color : coloresDelItem) {
                coloresItem.add(color.getRefColor().getNombre());
            }
            itemDTO.setColor(coloresItem);
        }

        return itemDTO;
    }
}