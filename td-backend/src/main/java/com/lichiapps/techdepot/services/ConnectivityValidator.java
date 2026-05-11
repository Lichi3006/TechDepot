package com.lichiapps.techdepot.services;

import com.lichiapps.techdepot.dtos.ItemCreateDTO;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Validador especializado en la integridad física de las conexiones.
 * Previene la creación de cables "imposibles" mediante teoría de intersección de funciones.
 */
@Component
public class ConnectivityValidator {

    /**
     * Valida que todos los extremos de un ítem estén vinculados funcionalmente.
     * @param conexiones Lista de conexiones con idExtremo
     * @param esCable Indica si el ítem es un cable para aplicar reglas más estrictas
     */
    public void validarConectividad(List<ItemCreateDTO.ConexionCreateDTO> conexiones, boolean esCable) {
        if (conexiones == null || conexiones.isEmpty()) return;

        // 1. Agrupamos funciones por extremo físico
        Map<Integer, Set<Long>> funcionesPorExtremo = conexiones.stream()
                .collect(Collectors.groupingBy(
                        ItemCreateDTO.ConexionCreateDTO::getIdExtremo,
                        Collectors.mapping(ItemCreateDTO.ConexionCreateDTO::getIdCategoriaFuncion, Collectors.toSet())
                ));

        // 2. REGLA FÍSICA: Un cable debe tener al menos 2 extremos físicos (puntas)
        if (esCable && funcionesPorExtremo.size() < 2) {
            throw new IllegalArgumentException("Error de Integridad Física: Un cable debe tener al menos 2 extremos (ej: un conector en cada punta).");
        }

        if (funcionesPorExtremo.size() < 2) return;

        // 3. Verificamos conectividad (Grafo Conexo)
        List<Integer> extremos = new ArrayList<>(funcionesPorExtremo.keySet());
        Set<Integer> visitados = new HashSet<>();
        Queue<Integer> cola = new LinkedList<>();

        cola.add(extremos.get(0));
        visitados.add(extremos.get(0));

        while (!cola.isEmpty()) {
            Integer actual = cola.poll();
            Set<Long> funcionesActual = funcionesPorExtremo.get(actual);

            for (Integer otro : extremos) {
                if (!visitados.contains(otro)) {
                    Set<Long> funcionesOtro = funcionesPorExtremo.get(otro);
                    
                    // Si comparten al menos una función, están conectados físicamente
                    if (!Collections.disjoint(funcionesActual, funcionesOtro)) {
                        visitados.add(otro);
                        cola.add(otro);
                    }
                }
            }
        }

        // 3. Si no visitamos todos, hay un extremo "flotando" (imposible)
        if (visitados.size() != extremos.size()) {
            throw new IllegalArgumentException("Error de Conectividad: Se detectaron extremos físicamente aislados. " +
                    "Un cable debe tener una ruta funcional continua (ej: no puedes unir un Schuko de Energía con un Jack de Audio).");
        }
    }
}
