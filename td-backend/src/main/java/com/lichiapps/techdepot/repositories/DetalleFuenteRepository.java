package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.DetalleFuente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleFuenteRepository extends JpaRepository<DetalleFuente, Long> {
    List<DetalleFuente> findByItemId(Long itemId);
    List<DetalleFuente> findByItemIdIn(List<Long> itemIds);
}