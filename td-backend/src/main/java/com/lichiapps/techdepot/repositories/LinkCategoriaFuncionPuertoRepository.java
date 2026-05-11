package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionPuerto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkCategoriaFuncionPuertoRepository extends JpaRepository<LinkCategoriaFuncionPuerto, LinkCategoriaFuncionPuerto.LinkCategoriaFuncionPuertoId> {
}
