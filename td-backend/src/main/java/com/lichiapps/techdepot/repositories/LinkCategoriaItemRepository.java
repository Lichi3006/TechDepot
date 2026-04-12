package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkCategoriaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Le avisa a Spring: "Este es el archivero de la tabla Item"
public interface LinkCategoriaItemRepository extends JpaRepository<LinkCategoriaItem, Long> {
    //...
}