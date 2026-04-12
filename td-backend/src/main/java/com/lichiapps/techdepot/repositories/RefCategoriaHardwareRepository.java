package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefCategoriaHardware;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefCategoriaHardwareRepository extends  JpaRepository<RefCategoriaHardware, Long>{

    Optional<RefCategoriaHardware> findByNombre(String nombre);
}