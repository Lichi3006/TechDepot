package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColorRepository extends  JpaRepository<Color, Long>{
    List<Color> findByItemId(Long itemId);
    List<Color> findByItemIdIn(List<Long> itemIds);
}