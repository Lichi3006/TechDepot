package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefTipoContenedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefTipoContenedorRepository extends JpaRepository<RefTipoContenedor, Long> {
}
