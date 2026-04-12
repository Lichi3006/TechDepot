package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefMarca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefMarcaRepository extends  JpaRepository<RefMarca, Long>{

    Optional<RefMarca> findByNombre(String elNombreQueBusco);
}