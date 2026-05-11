package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.dtos.ItemFilterDTO;
import com.lichiapps.techdepot.entities.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ItemSpecification {

    public static Specification<Item> withFilters(ItemFilterDTO filters) {
        return (Root<Item> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filtrado por Marcas
            if (filters.getIdsMarcas() != null && !filters.getIdsMarcas().isEmpty()) {
                predicates.add(root.get("marca").get("id").in(filters.getIdsMarcas()));
            }

            // 2. Filtrado por Estados
            if (filters.getIdsEstados() != null && !filters.getIdsEstados().isEmpty()) {
                predicates.add(root.get("estado").get("id").in(filters.getIdsEstados()));
            }

            // 3. Filtrado por Contenedores
            if (filters.getIdsContenedores() != null && !filters.getIdsContenedores().isEmpty()) {
                predicates.add(root.get("contenedor").get("id").in(filters.getIdsContenedores()));
            }

            // 4. Filtrado por Puertos (Requires Join with LINK_ExtremoFisico)
            if (filters.getIdsPuertos() != null && !filters.getIdsPuertos().isEmpty()) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<LinkExtremoFisico> linkExtremo = subquery.from(LinkExtremoFisico.class);
                subquery.select(linkExtremo.get("item").get("id"))
                        .where(linkExtremo.get("puerto").get("id").in(filters.getIdsPuertos()));
                predicates.add(root.get("id").in(subquery));
            }

            // 5. Filtrado por Categorías de Función (Requires Join with LINK_ExtremoFisico)
            if (filters.getIdsCategoriasFuncion() != null && !filters.getIdsCategoriasFuncion().isEmpty()) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<LinkExtremoFisico> linkExtremo = subquery.from(LinkExtremoFisico.class);
                subquery.select(linkExtremo.get("item").get("id"))
                        .where(linkExtremo.get("categoriaFuncion").get("id").in(filters.getIdsCategoriasFuncion()));
                predicates.add(root.get("id").in(subquery));
            }

            // 6. Filtrado por Categorías de Hardware (Requires Join with DetalleHardware -> LINK_CategoriaHardware)
            if (filters.getIdsCategoriasHardware() != null && !filters.getIdsCategoriasHardware().isEmpty()) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<LinkCategoriaHardware> linkCatHw = subquery.from(LinkCategoriaHardware.class);
                subquery.select(linkCatHw.get("detalleHardware").get("item").get("id"))
                        .where(linkCatHw.get("refCategoriaHardware").get("id").in(filters.getIdsCategoriasHardware()));
                predicates.add(root.get("id").in(subquery));
            }

            // 7. Búsqueda por texto (Query)
            if (filters.getQuery() != null && !filters.getQuery().isEmpty()) {
                String searchPattern = "%" + filters.getQuery().toLowerCase() + "%";
                
                // Búsqueda en Marca
                Predicate brandPredicate = cb.like(cb.lower(root.get("marca").get("nombre")), searchPattern);
                
                // Búsqueda en Modelo (Requires join with DetalleHardware)
                Subquery<Long> hwSubquery = query.subquery(Long.class);
                Root<DetalleHardware> detHw = hwSubquery.from(DetalleHardware.class);
                hwSubquery.select(detHw.get("item").get("id"))
                        .where(cb.like(cb.lower(detHw.get("modeloAlfanumerico")), searchPattern));
                
                Predicate modelPredicate = root.get("id").in(hwSubquery);
                
                predicates.add(cb.or(brandPredicate, modelPredicate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
