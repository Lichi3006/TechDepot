package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.DetalleHardware;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetalleHardwareRepository extends  JpaRepository<DetalleHardware, Long>{

    Optional<DetalleHardware> findByModeloAlfanumerico(String modeloAlfanumerico);

    List<DetalleHardware> findByItemId(Long itemId);
    List<DetalleHardware> findByItemIdIn(List<Long> itemIds);
}