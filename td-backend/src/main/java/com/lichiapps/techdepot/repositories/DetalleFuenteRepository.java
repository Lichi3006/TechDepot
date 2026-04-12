package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.DetalleFuente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleFuenteRepository extends  JpaRepository<DetalleFuente, Long>{
}