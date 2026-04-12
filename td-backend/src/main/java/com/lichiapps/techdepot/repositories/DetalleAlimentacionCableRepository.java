package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.DetalleAlimentacionCable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DetalleAlimentacionCableRepository extends  JpaRepository<DetalleAlimentacionCable, Long>{

    Optional<DetalleAlimentacionCable> findByAmperajeMax(Integer amperajeMax);
}