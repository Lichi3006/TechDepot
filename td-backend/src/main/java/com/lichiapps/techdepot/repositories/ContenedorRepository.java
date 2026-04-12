package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.Contenedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContenedorRepository extends  JpaRepository<Contenedor, Long>{
}