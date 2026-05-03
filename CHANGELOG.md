# Changelog - TechDepot

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Arquitectura de Contenedores Estandarizada**: Incorporación de la tabla maestra `REF_TipoContenedor` para centralizar la gestión de prefijos logísticos (ej: `DAT`, `PWR`, `NET`), eliminando la variabilidad manual.
- **Sistema de Numeración Secuencial**: Implementación en el backend de un generador automático de nombres unívocos siguiendo el estándar `[PREFIJO]-[SECUENCIA]-[UUID_CORTO]` (ej: `DAT-01-A1B2`).
- **Controladores y Servicios de Gestión de Tipos**: Nuevos *endpoints* en `/api/tipos-contenedor` para administrar las categorías de almacenamiento de forma independiente.
- **Base de Datos V2**: Implementación de un esquema relacional inteligente que elimina la categorización manual de items, delegando la responsabilidad a la composición física de los extremos.
- **Inferencia de Categoría por Función**: Integración de `IdREF_CategoriaFuncion` en cada extremo físico (`LINK_ExtremoFisico`), validado contra una matriz de capacidades por puerto (`LINK_CategoriaFuncionPuerto`).
- **Mapeo "Ghost Mode" en JPA**: Refactorización de `LinkProtocoloDeExtremo` utilizando relaciones simples combinadas con propiedades manuales redundantes. Esto permite que Hibernate respete las reglas de integridad cruzadas de SQL Server sin intentar validarlas de forma redundante, resolviendo errores de mapeo en el arranque.
- **Optimización Mediante Índices**: Adición de Índices Non-Clustered en columnas de Foreign Keys críticas (`IdItem`, `IdLINK_ExtremoFisico`) para optimizar el rendimiento de las consultas del Facade Pattern y evitar escaneos completos de tablas.
- **Vista de Inferencia SQL**: Creación de `v_InventarioDetallado` que utiliza `STRING_AGG` para consolidar las funciones de un item en un solo campo dinámico.
- Nueva arquitectura modular en el Frontend basada en páginas (`InventoryPage`, `ItemEditorPage`, `ParametersPage`) y layouts (`MainLayout`).
- Navegación del lado del cliente mediante `react-router-dom`.
- Formulario de creación dinámico (`ItemForm`) que consume datos reales de la base de datos.
- Nueva sección de "Parámetros" para gestionar listas maestras (Marcas, Colores, Estados, Tipos de Contenedor) de forma independiente.

### Changed
- **Frontend Dirigido por Tipos**: El flujo de creación de contenedores ahora exige la selección de un tipo formal de la base de datos, garantizando la consistencia de los prefijos generados.
- **Refactorización de Mapeo y DTOs**: El `ItemDTOMapperService` ahora calcula la categoría del ítem en tiempo real basándose en la intersección de funciones de sus extremos.
- **Depuración Estructural**: Eliminación completa de entidades, repositorios y servicios obsoletos relacionados con `LinkCategoriaItem` y `RefCategoriaItem`.
- **Validación Estricta**: `ItemValidationService` ahora exige la definición de funciones por conexión, asegurando la integridad del nuevo modelo de datos.
- Se agregó el campo `Nombre` a la entidad `Contenedor` para almacenar la nomenclatura generada automáticamente.
- Refactorización de `App.tsx` para actuar como enrutador principal del sistema.
- Mejora en la resiliencia del Frontend mediante el uso de "Optional Chaining" y valores por defecto en la renderización de tablas.
- Métodos del Backend españolizados para mantener convención (ej: `getAllRefColors` a `getAllRefColores`).

### Fixed
- **Error Crítico de Arranque**: Resolución de `Error starting ApplicationContext` (MappingException) mediante el desacoplamiento de llaves compuestas en Hibernate, manteniendo la integridad referencial en SQL Server.
- Errores de compilación de TypeScript relacionados con `verbatimModuleSyntax` mediante el uso de `import type`.
- Problemas de carga en blanco del Frontend causados por datos incompletos del backend.
- Fallo en la creación de items de prueba debido a IDs inexistentes (reemplazado por selección dinámica).
- Desbloqueo de repositorio Git tras rebase fallido y sincronización con el remote principal.
