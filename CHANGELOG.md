# Changelog - TechDepot

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Sistema de Colores HEX**: Evolucion de la gestion de colores hacia un modelo hibrido que soporta codigos HEX directamente en la base de datos, permitiendo una personalizacion total por item.
- **Color Picker Dinamico**: Integracion de la libreria `react-colorful` en el frontend, proporcionando un mapa de color interactivo para la seleccion precisa de tonos.
- **Paleta de Presets**: Nueva grilla de colores comunes (Negro, Blanco, Gris, etc.) en el formulario para una carga rapida basada en el catalogo `REF_Color`.
- Visualizacion en Tabla: Los colores de los items ahora se representan mediante circulos de color generados por CSS en la tabla de inventario, mejorando el feedback visual inmediato.
- Inferencia Automatica de Funcion: Implementacion de logica en el frontend para derivar la categoria de funcion (Energia/Datos/Video) segun el puerto o protocolo seleccionado, eliminando la intervencion manual del usuario.
- Matriz de Capacidades: Nuevo endpoint en /api/puertos-capacidades para exponer la relacion formal entre hardware y funcionalidad.
- Base de Datos V2: Implementacion de un esquema relacional inteligente que elimina la categorizacion manual de items, delegando la responsabilidad a la composicion fisica de los extremos.
- Inferencia de Categoria por Funcion: Integracion de IdREF_CategoriaFuncion en cada extremo fisico (LINK_ExtremoFisico), validado contra una matriz de capacidades por puerto (LINK_CategoriaFuncionPuerto).
- Mapeo Ghost Mode en JPA: Refactorizacion de LINK_ProtocoloDeExtremo utilizando relaciones simples combinadas con propiedades manuales redundantes. Esto permite que Hibernate respete las reglas de integridad cruzadas de SQL Server sin intentar validarlas de forma redundante, resolviendo errores de mapeo en el arranque.
- Optimizacion Mediante Indices: Adicion de Indices Non-Clustered en columnas de Foreign Keys criticas (IdItem, IdLINK_ExtremoFisico) para optimizar el rendimiento de las consultas del Facade Pattern y evitar escaneos completos de tablas.
- Vista de Inferencia SQL: Creacion de v_InventarioDetallado que utiliza STRING_AGG para consolidar las funciones de un item en un solo campo dinamico.
- Datos Semilla (Seed Data): Incorporacion de inserciones basicas en el script SQL maestro (Estados, Puertos, Protocolos y Capacidades) para facilitar la puesta en marcha inmediata del sistema.
- Nueva arquitectura modular en el Frontend basada en paginas (InventoryPage, ItemEditorPage, ParametersPage) y layouts (MainLayout).
- Navegacion del lado del cliente mediante react-router-dom.
- Formulario de creacion dinamico (ItemForm) que consume datos reales de la base de datos.
- Nueva seccion de Parametros para gestionar listas maestras (Marcas, Colores, Estados, Tipos de Contenedor) de forma independiente.
- Arquitectura de Contenedores Estandarizada: Incorporacion de la tabla maestra REF_TipoContenedor para centralizar la gestion de prefijos logisticos (ej: DAT, PWR, NET), eliminando la variabilidad manual.
- Sistema de Numeracion Secuencial: Implementacion en el backend de un generador automatico de nombres univocos siguiendo el estandar [PREFIJO]-[SECUENCIA]-[UUID_CORTO] (ej: DAT-01-A1B2).
- Controladores y Servicios de Gestion de Tipos: Nuevos endpoints en /api/tipos-contenedor para administrar las categorias de almacenamiento de forma independiente.

### Changed
- Frontend Dirigido por Tipos: El flujo de creacion de contenedores ahora exige la seleccion de un tipo formal de la base de datos, garantizando la consistencia de los prefijos generados.
- Refactorizacion de Mapeo y DTOs: El ItemDTOMapperService ahora calcula la categoria del item en tiempo real basandose en la interseccion de funciones de sus extremos.
- Depuracion Estructural: Eliminacion completa de entidades, repositorios y servicios obsoletos relacionados con LinkCategoriaItem y RefCategoriaItem.
- Validacion Estricta: ItemValidationService ahora exige la definicion de funciones por conexion, asegurando la integridad del nuevo modelo de datos.
- Se agrego el campo Nombre a la entidad Contenedor para almacenar la nomenclatura generada automaticamente.
- Refactorizacion de App.tsx para actuar como enrutador principal del sistema.
- Mejora en la resiliencia del Frontend mediante el uso de Optional Chaining y valores por defecto en la renderizacion de tablas.
- Metodos del Backend españolizados para mantener convencion (ej: getAllRefColors a getAllRefColores).

### Fixed
- Error de compilacion en RefCategoriaFuncionController debido a nombre de metodo incorrecto (getAllRefCategoriaFuncion).
- Error Critico de Arranque: Resolucion de Error starting ApplicationContext (MappingException) mediante el desacoplamiento de llaves compuestas en Hibernate, manteniendo la integridad referencial en SQL Server.
- Errores de compilacion de TypeScript relacionados con verbatimModuleSyntax mediante el uso de import type.
- Problemas de carga en blanco del Frontend causados por datos incompletos del backend.
- Fallo en la creacion de items de prueba debido a IDs inexistentes (reemplazado por seleccion dinamica).
- Desbloqueo de repositorio Git tras rebase fallido y sincronización con el remote principal.
