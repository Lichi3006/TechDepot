package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefBlindajeExternoCable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefBlindajeExternoCableRepository extends  JpaRepository<RefBlindajeExternoCable, Long>{

    Optional<RefBlindajeExternoCable> findByNombre(String nombre);
}