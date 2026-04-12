package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.RefEstado;
import com.lichiapps.techdepot.entities.RefMarca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefEstadoRepository extends  JpaRepository<RefEstado, Long>{

    Optional<RefEstado> findByNombre(String elNombreQueBusco);

}