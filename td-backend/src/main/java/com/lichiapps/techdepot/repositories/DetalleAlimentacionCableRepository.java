package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.DetalleAlimentacionCable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DetalleAlimentacionCableRepository extends  JpaRepository<DetalleAlimentacionCable, Long>{

    Optional<DetalleAlimentacionCable> findByAmperajeMax(Short amperajeMax);

    Optional<DetalleAlimentacionCable> findByDetalleCableId(Long detalleCableId);

    java.util.List<DetalleAlimentacionCable> findByDetalleCableIdIn(java.util.List<Long> detalleCableIds);

    void deleteByDetalleCableId(Long detalleCableId);
}