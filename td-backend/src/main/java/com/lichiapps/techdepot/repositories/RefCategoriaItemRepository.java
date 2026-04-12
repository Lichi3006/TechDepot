package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefCategoriaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefCategoriaItemRepository extends  JpaRepository<RefCategoriaItem, Long>{

    Optional<RefCategoriaItem> findByNombre(String nombre);
}