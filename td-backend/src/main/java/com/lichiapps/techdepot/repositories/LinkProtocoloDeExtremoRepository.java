package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkProtocoloDeExtremo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkProtocoloDeExtremoRepository extends  JpaRepository<LinkProtocoloDeExtremo, Long>{
}