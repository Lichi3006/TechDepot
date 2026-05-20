package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkCategoriaHardware;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinkCategoriaHardwareRepository extends JpaRepository<LinkCategoriaHardware, Long> {
    List<LinkCategoriaHardware> findByDetalleHardwareId(Long hardwareId);
    List<LinkCategoriaHardware> findByDetalleHardwareIdIn(List<Long> hardwareIds);
    boolean existsByRefCategoriaHardwareId(Long id);
}