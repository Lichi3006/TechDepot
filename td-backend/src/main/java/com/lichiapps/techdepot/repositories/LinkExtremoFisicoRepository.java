package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkExtremoFisico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinkExtremoFisicoRepository extends JpaRepository<LinkExtremoFisico, Long> {
    List<LinkExtremoFisico> findByItemId(Long itemId);
    List<LinkExtremoFisico> findByItemIdIn(List<Long> itemIds);
    boolean existsByPuertoId(Long puertoId);
}