package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefCategoriaFuncion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefCategoriaFuncionRepository extends  JpaRepository<RefCategoriaFuncion, Long>{

    Optional<RefCategoriaFuncion> findByNombre(String nombre);
}