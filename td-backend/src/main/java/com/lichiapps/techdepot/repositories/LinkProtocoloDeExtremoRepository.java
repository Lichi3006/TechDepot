package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkProtocoloDeExtremo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinkProtocoloDeExtremoRepository extends JpaRepository<LinkProtocoloDeExtremo, Long> {
    List<LinkProtocoloDeExtremo> findByExtremoFisicoId(Long extremoFisicoId);
    List<LinkProtocoloDeExtremo> findByExtremoFisicoIdIn(List<Long> extremoFisicoIds);
    boolean existsByProtocoloId(Long protocoloId);
}