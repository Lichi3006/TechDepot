package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.DetalleCable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleCableRepository extends  JpaRepository<DetalleCable, Long>{
}