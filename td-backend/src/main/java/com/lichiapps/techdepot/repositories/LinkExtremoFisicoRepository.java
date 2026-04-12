package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkExtremoFisico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkExtremoFisicoRepository extends  JpaRepository<LinkExtremoFisico, Long>{
}