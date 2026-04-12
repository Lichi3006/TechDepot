package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefPuerto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefPuertoRepository extends  JpaRepository<RefPuerto, Long>{

    Optional<RefPuerto> findByNombre(String nombre);
}