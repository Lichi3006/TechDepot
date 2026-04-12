package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefBlindajeInternoCable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefBlindajeInternoCableRepository extends  JpaRepository<RefBlindajeInternoCable, Long>{

    Optional<RefBlindajeInternoCable> findByNombre(String nombre);
}