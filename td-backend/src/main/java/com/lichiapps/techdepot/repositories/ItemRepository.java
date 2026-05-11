package com.lichiapps.techdepot.repositories;

import com.lichiapps.techdepot.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository // Le avisa a Spring: "Este es el archivero de la tabla Item"
public interface ItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {
    //...
}

// 1. INTERFAZ: Esto es solo un "Menú" o contrato. No hay código real escrito acá.
// 2. extends JpaRepository: Heredamos el menú gigante de Spring con los métodos CRUD ya listos (save, findById, findAll, delete).
// 3. <Item, Long> (Genéricos): Configuramos la plantilla para decirle: "Trabajá exclusivamente con la clase Item, y acordate que su ID es un Long".
// 4. LA MAGIA: Al arrancar la app, Spring Boot lee este contrato y fabrica una clase invisible en la memoria RAM que ejecuta el código SQL por atrás.