# Changelog - TechDepot

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nueva arquitectura modular en el Frontend basada en páginas (`InventoryPage`, `ItemEditorPage`, `ParametersPage`) y layouts (`MainLayout`).
- Navegación del lado del cliente mediante `react-router-dom`.
- Formulario de creación dinámico (`ItemForm`) que consume datos reales de la base de datos.
- Nueva sección de "Parámetros" para gestionar listas maestras (Marcas, Colores, Estados) de forma independiente.
- Controladores Backend para entidades de referencia: `RefEstadoController`, `RefColorController`, `ContenedorController`, `RefCategoriaItemController`, `RefPuertoController`, `RefProtocoloController`.
- Servicio de referencias en el Frontend (`refService.ts`) para centralizar la gestión de tablas maestras.
- Botón de creación rápida de marcas directamente desde el formulario de items.

### Changed
- Refactorización de `App.tsx` para actuar como enrutador principal del sistema.
- Mejora en la resiliencia del Frontend mediante el uso de "Optional Chaining" y valores por defecto en la renderización de tablas.

### Fixed
- Errores de compilación de TypeScript relacionados con `verbatimModuleSyntax` mediante el uso de `import type`.
- Problemas de carga en blanco del Frontend causados por datos incompletos del backend.
- Fallo en la creación de items de prueba debido a IDs inexistentes (reemplazado por selección dinámica).
- Desbloqueo de repositorio Git tras rebase fallido y sincronización con el remote principal.
