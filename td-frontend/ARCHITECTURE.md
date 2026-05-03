# Arquitectura de TechDepot - Frontend

Este documento detalla la estructura y decisiones técnicas del frontend de TechDepot (React + TypeScript).

## 1. Estructura de Proyecto (Modular)

Hemos migrado de una Single Page Application (SPA) plana a una arquitectura basada en **Páginas y Layouts** para soportar el crecimiento del sistema:

- **`/src/layouts`**: Contiene los marcos visuales de la aplicación (ej: `MainLayout` con Sidebar fijo).
- **`/src/pages`**: Secciones independientes de la aplicación:
  - `InventoryPage`: Visualización y filtrado de stock con lógica de inferencia.
  - `ItemEditorPage`: Formulario de creación/edición de items.
  - `ParametersPage`: Nueva sección administrativa para gestionar tablas maestras (REFs).
- **`/src/services`**: Capa de comunicación con la API (Axios). Separamos `itemService` de `refService` para mayor claridad.

## 2. Enrutamiento y Navegación

- **React Router DOM**: Implementado para gestionar URLs limpias (ej: `/admin/nuevo`). Permite el uso de botones de navegación del navegador sin perder el estado de la aplicación.
- **Layouts con Outlet**: El Sidebar se mantiene consistente gracias al uso de `<Outlet />`, evitando re-renderizados innecesarios de la estructura principal.

## 3. Robustez y Calidad de Código

- **Renderización Defensiva**: Uso extensivo de *Optional Chaining* (`?.`) para manejar la asincronía y posibles nulos del backend, evitando el error de "pantalla blanca".
- **TypeScript Estricto**: Configuración `verbatimModuleSyntax` para asegurar importaciones de tipos explícitas, mejorando la velocidad de compilación y la claridad del código.

## 4. Evolución V2: UI Inteligente

Con la llegada del esquema de base de datos V2, el frontend ha evolucionado:
- **Formulario Dinámico**: Ya no se eligen categorías manualmente. Al elegir un puerto, el formulario consulta sus capacidades y permite seleccionar la función (Energía/Datos/Video).
- **Inferencia Visual**: La tabla de inventario muestra la categoría calculada por el backend, reflejando fielmente la composición física de los items sin intervención del usuario.
- **Administración en Vivo**: Capacidad de agregar nuevas marcas o parámetros directamente desde los formularios de carga, sincronizando con el backend mediante peticiones `POST` atómicas.
