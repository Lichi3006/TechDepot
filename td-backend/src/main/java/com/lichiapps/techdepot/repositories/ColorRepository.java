package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends  JpaRepository<Color, Long>{
}