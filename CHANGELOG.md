# Changelog - TechDepot

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nueva entidad `LinkCategoriaHardware` para soportar relaciones Muchos-a-Muchos entre `DetalleHardware` y categorías, eliminando la limitación de categoría única.
- Métodos de búsqueda optimizados `findByItemId` en múltiples repositorios para mejorar el rendimiento de filtrado en la base de datos.
- Documentación técnica: `ARCHITECTURE.md` y `CHANGELOG.md`.
- Validaciones de consistencia cruzada en `ItemValidationService` para asegurar que cada categoría tenga su detalle correspondiente.

### Changed
- Refactorización de métricas eléctricas (Voltaje, Amperaje) de tipos primitivos a `Short` para permitir valores nulos y optimizar el almacenamiento en SQL Server mediante `TINYINT/SMALLINT`.
- Actualización de la estrategia de borrado en `ItemService` para ser más granular y eficiente.
- Mejora en `ItemDTOMapperService` para optimizar la obtención de un único Item por ID y agregada protección contra nulos en el mapeo de contenedores.

### Fixed
- Error de ejecución DDL en Hibernate al intentar modificar columnas con restricciones únicas (Unique Constraints).
- Eliminación de generación automática de constraints "basura" por parte de Hibernate mediante el ajuste de `@Column` y `ddl-auto=none`.
- Problemas de rendimiento en `ItemDetalleService` al reemplazar escaneos completos de tablas (`findAll()`) por consultas filtradas por ID.
