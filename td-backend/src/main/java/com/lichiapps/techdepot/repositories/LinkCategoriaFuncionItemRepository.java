package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.LinkCategoriaFuncionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkCategoriaFuncionItemRepository extends  JpaRepository<LinkCategoriaFuncionItem, Long>{
}