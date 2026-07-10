package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefColorRepository extends  JpaRepository<RefColor, Long>{

    Optional<RefColor> findByCodigoHex(String codigoHex);
}