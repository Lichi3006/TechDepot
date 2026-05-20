package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefProtocolo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefProtocoloRepository extends  JpaRepository<RefProtocolo, Long>{

    Optional<RefProtocolo> findByNombre(String nombre);
    java.util.List<RefProtocolo> findByPuertoId(Long puertoId);
}