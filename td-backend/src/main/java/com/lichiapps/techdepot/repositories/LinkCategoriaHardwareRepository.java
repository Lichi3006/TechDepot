package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkCategoriaHardware;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkCategoriaHardwareRepository extends JpaRepository<LinkCategoriaHardware, Long> {
}