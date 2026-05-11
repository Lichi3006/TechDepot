package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemDTO;
import com.lichiapps.techdepot.entities.*;
import com.lichiapps.techdepot.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Servicio de mapeo para transformar entidades Item a ItemDTO.
 * Recopila todos los datos relacionados de un Item de forma optimizada.
 */
@Service
public class ItemDTOMapperService {

    @Autowired private ItemCrudService itemCrudService;
    
    // Repositorios para consultas directas y optimizadas
    @Autowired private ColorRepository colorRepository;
    @Autowired private DetalleCableRepository detalleCableRepository;
    @Autowired private DetalleFuenteRepository detalleFuenteRepository;
    @Autowired private DetalleHardwareRepository detalleHardwareRepository;
    @Autowired private LinkExtremoFisicoRepository linkExtremoFisicoRepository;
    @Autowired private LinkProtocoloDeExtremoRepository linkProtocoloDeExtremoRepository;
    @Autowired private DetalleAlimentacionCableRepository detalleAlimentacionCableRepository;
    @Autowired private LinkCategoriaHardwareRepository linkCategoriaHardwareRepository;

    /**
     * Obtiene el DTO de un item específico de forma optimizada.
     */
    public ItemDTO obtenerItemDTOPorId(Long idItem) {
        Item item = itemCrudService.obtenerItemPorId(idItem);
        if (item == null) return null;

        // Consultas quirúrgicas por ItemID
        List<LinkExtremoFisico> extremos = linkExtremoFisicoRepository.findByItemId(idItem);
        List<Color> colores = colorRepository.findByItemId(idItem);
        List<DetalleCable> cables = detalleCableRepository.findByItemId(idItem);
        List<DetalleHardware> hardwares = detalleHardwareRepository.findByItemId(idItem);
        List<DetalleFuente> fuentes = detalleFuenteRepository.findByItemId(idItem);

        // Protocolos (dependen de los extremos encontrados)
        List<LinkProtocoloDeExtremo> protocolos = new ArrayList<>();
        for (LinkExtremoFisico ext : extremos) {
            protocolos.addAll(linkProtocoloDeExtremoRepository.findByExtremoFisicoId(ext.getId()));
        }

        // Alimentación (depende de los cables encontrados)
        List<DetalleAlimentacionCable> alimentaciones = new ArrayList<>();
        for (DetalleCable cable : cables) {
            detalleAlimentacionCableRepository.findByDetalleCableId(cable.getId()).ifPresent(alimentaciones::add);
        }

        // Categorías Hardware (dependen de los hardwares encontrados)
        List<LinkCategoriaHardware> categoriasHW = new ArrayList<>();
        for (DetalleHardware hw : hardwares) {
            categoriasHW.addAll(linkCategoriaHardwareRepository.findByDetalleHardwareId(hw.getId()));
        }

        return convertirAItemDTO(item, extremos, protocolos, cables, hardwares, fuentes, colores, alimentaciones, categoriasHW);
    }

    /**
     * Convierte una lista de items a DTO evitando el problema de N+1 queries.
     * Utiliza consultas con cláusula IN para traer solo lo necesario de la BD.
     */
    public List<ItemDTO> convertirListaAItemDTO(List<Item> items) {
        if (items.isEmpty()) return new ArrayList<>();

        List<Long> itemIds = items.stream().map(Item::getId).toList();

        // 1. Traemos los datos de primer nivel (relacionados directamente con Item)
        List<LinkExtremoFisico> linkExtremoFisicos = linkExtremoFisicoRepository.findByItemIdIn(itemIds);
        List<DetalleCable> detalleCables = detalleCableRepository.findByItemIdIn(itemIds);
        List<DetalleHardware> detalleHardwares = detalleHardwareRepository.findByItemIdIn(itemIds);
        List<DetalleFuente> detalleFuentes = detalleFuenteRepository.findByItemIdIn(itemIds);
        List<Color> colores = colorRepository.findByItemIdIn(itemIds);

        // 2. Extraemos los IDs intermedios para el segundo nivel de relaciones
        List<Long> extremoIds = linkExtremoFisicos.stream().map(LinkExtremoFisico::getId).toList();
        List<Long> cableIds = detalleCables.stream().map(DetalleCable::getId).toList();
        List<Long> hardwareIds = detalleHardwares.stream().map(DetalleHardware::getId).toList();

        // 3. Traemos los datos de segundo nivel
        List<LinkProtocoloDeExtremo> linkProtocoloDeExtremos = extremoIds.isEmpty() ? new ArrayList<>() :
                linkProtocoloDeExtremoRepository.findByExtremoFisicoIdIn(extremoIds);
        
        List<DetalleAlimentacionCable> alimentaciones = cableIds.isEmpty() ? new ArrayList<>() :
                detalleAlimentacionCableRepository.findByDetalleCableIdIn(cableIds);
        
        List<LinkCategoriaHardware> categoriasHardware = hardwareIds.isEmpty() ? new ArrayList<>() :
                linkCategoriaHardwareRepository.findByDetalleHardwareIdIn(hardwareIds);

        // 4. Mapeamos cada item utilizando los datos precargados en memoria
        List<ItemDTO> itemsDTO = new ArrayList<>();
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