# Arquitectura de TechDepot - Frontend

Este documento detalla la estructura y decisiones técnicas del frontend de TechDepot (React + TypeScript).

## 1. Estructura de Proyecto (Modular)

Hemos migrado de una Single Page Application (SPA) plana a una arquitectura basada en **Páginas y Layouts** para soportar el crecimiento del sistema:

- **`/src/layouts`**: Contiene los marcos visuales de la aplicación (ej: `MainLayout` con Sidebar).
- **`/src/pages`**: Secciones independientes de la aplicación:
  - `InventoryPage`: Visualización y filtrado de stock.
  - `ItemEditorPage`: Formulario de creación/edición de items.
  - `ParametersPage`: Gestión de tablas maestras (REFs).
- **`/src/services`**: Capa de comunicación con la API (Axios), separando la lógica de negocio de los componentes de UI.
- **`/src/components`**: Componentes reutilizables divididos en `ui` (elementos básicos) y `inventory` (componentes de dominio).

## 2. Enrutamiento y Estado

- **React Router DOM**: Implementado para gestionar la navegación sin recarga de página, permitiendo URLs limpias para cada sección.
- **Estado Local**: Utilizamos `useState` y `useEffect` para la gestión de datos por página. En el futuro, se evaluará Context API para estados globales (ej: notificaciones).

## 3. Robustez y Tipado

- **TypeScript Estricto**: Uso de `verbatimModuleSyntax` para asegurar importaciones limpias y `import type` para separar tipos de lógica ejecutable.
- **Renderización Defensiva**: Implementación de *Optional Chaining* (`?.`) y valores por defecto en componentes críticos para prevenir errores de "pantalla blanca" ante datos inconsistentes o nulos provenientes del backend.

## 4. Flujo de Creación de Items

El formulario de creación es dinámico:
1. Al cargar, solicita todas las listas de referencia (Marcas, Estados, etc.) al backend.
2. Permite la creación "al vuelo" de parámetros faltantes (ej: nueva Marca) mediante el servicio de referencias.
3. Envía un `ItemCreateDTO` plano al backend, asegurando que solo se utilicen IDs válidos existentes en la base de datos.
