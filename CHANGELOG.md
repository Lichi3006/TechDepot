# Changelog - TechDepot

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Docker Compose**: Infraestructura completa de contenedores para levantar todo el proyecto con un solo comando (`docker compose up`). Incluye SQL Server 2022 Express, inicialización automática de la base de datos, backend Spring Boot y frontend React+Nginx.
- **Dockerfiles multi-stage**: Dockerfiles optimizados con compilación en capas para el backend (Java 21 + Maven) y el frontend (Node 20 + Nginx), reduciendo el tamaño de las imágenes finales.
- **Inicialización automática de BD**: Contenedor `db-init` que detecta si la base de datos `TechDepot` ya existe y solo ejecuta el script SQL en la primera ejecución.

## [0.2.0-alpha] - 2026-07-10

### Added
- **Escáner QR Nativo**: Implementación de un escáner de códigos QR en pantalla completa para dispositivos móviles, integrado mediante la librería `html5-qrcode`. Permite leer etiquetas UUID para ubicar contenedores instantáneamente.
- **Soporte Móvil (HTTPS)**: Integración del plugin `@vitejs/plugin-basic-ssl` para habilitar el entorno de desarrollo seguro (HTTPS), requisito indispensable para solicitar permisos de cámara en celulares.
- **Color Picker Realtime**: Incorporación del componente `HexColorPicker` (`react-colorful`) en la gestión de colores, con previsualización en vivo y campo hexadecimal editable sincronizado.
- **Gestor de Contenedores Renombrado**: Oficialización del término "Contenedores" en toda la interfaz de usuario y navegación (reemplazando "Cajas").

### Changed
- **Rediseño UI Móvil**: Renovación completa de la vista de inventario (tabla de ítems) para adaptarse a pantallas móviles, organizando la información en tarjetas con 3 secciones claras (Conexiones, Ubicación, Características).
- **Estética de Paneles Administrativos**: Refactorización visual profunda en las secciones de Contenedores, Blindajes de Cables y Colores. Se implementó una grilla simétrica (`stretch`), paneles con estilo de superficie oscura y tablas modernas inspiradas en el gestor de protocolos.
- **Flujo de Tipos de Contenedor**: Transición de tarjetas en grilla a una vista de lista (tabla) para los tipos de contenedor, mejorando la lectura y arreglando problemas de desbordamiento en dispositivos pequeños.

### Fixed
- **Formulario de Prefijos**: Solución al problema visual donde el prefijo del contenedor quedaba cortado; se aplicó un contenedor `flex-wrap` dinámico.
- **Variables de Estilo Huérfanas**: Limpieza de declaraciones CSS no utilizadas en múltiples componentes de React para permitir el correcto empaquetado (build) del proyecto en producción.

### Removed
- **Dependencias No Utilizadas**: Eliminación de `lucide-react` del archivo README y dependencias ya que los íconos se reemplazaron por SVG puros.

## [0.1.0-alpha]

### Added
- **Datos Semilla**: Nuevos datos semilla (seed data) en [TechDepotTablesQuery.sql](file:///C:/Users/User/Desktop/Proyectos/TechDepot/TechDepot/database/TechDepotTablesQuery.sql) para categorías de hardware (`REF_CategoriaHardware`) y marcas (`REF_Marca`), con inserciones ejecutadas en la base de datos local.
- **Gestores Individuales**: Implementación de pantallas de gestión dedicadas (BrandManagerPage, HardwareCategoryManagerPage y CableShieldingManagerPage) para administrar de forma limpia marcas, categorías de hardware y blindajes de cables (interno/externo).
- **Borrado Seguro de Marcas, Categorías y Blindajes**: Incorporación de validaciones en el backend (existsBy...) para evitar la eliminación de referencias (marcas, categorías, blindajes) que estén en uso en el inventario, retornando errores descriptivos al usuario.
- **Borrado de Protocolos**: Exposición del endpoint DELETE /api/protocolos/{id} con comprobación de no uso en ítems para poder eliminar protocolos obsoletos directamente desde la interfaz.
- **Eliminación Segura de Puertos**: Implementación de eliminación transaccional de puertos en RefPuertoService que borra automáticamente protocolos y capacidades asociadas si el puerto no está en uso.
- **Validación de Uso de Puerto**: Bloqueo de seguridad que impide la eliminación física de puertos asociados a ítems del inventario, informando al usuario del motivo.
- **Gestión Rápida de Marcas y Colores**: Incorporación de botones "+" en el formulario de ítems para registrar marcas y colores comunes en caliente desde el formulario.
- **Creación de Funciones Físicas**: Panel para agregar y listar categorías de función en PortManagerPage.
- **Administración de Tipos de Contenedor**: Nueva interfaz de gestión de tipos de contenedor en ContainerManagerPage.
- **Sistema de Filtrado Avanzado**: Implementacion de un motor de busqueda dinamico tipo e-commerce que permite filtrar el inventario por marcas, estados, puertos, funciones y categorias de hardware de forma simultanea.
- **Búsqueda Global por Texto**: Integracion de busqueda por coincidencia parcial en marcas y modelos de hardware directamente desde la barra de herramientas.
- **Infraestructura de Consultas Dinámicas**: Incorporacion de `JpaSpecificationExecutor` y el patron `Specification` en el backend para generar consultas SQL optimizadas basadas en criterios variables.
- **Barra Lateral de Filtros (Sidebar)**: Rediseño completo de la UI de filtrado hacia un modelo lateral profesional, incluyendo mini-buscadores por seccion para una navegacion fluida en catalogos extensos.
- **Controlador de Categorías de Hardware**: Nuevo endpoint `/api/categorias-hardware` para permitir la gestion y filtrado por tipos especificos de componentes.
- **Gestión de Infraestructura Física**: Nueva interfaz administrativa para crear Puertos y Protocolos, permitiendo configurar la matriz de capacidades lógicas del sistema de forma dinámica.
- **Gestor de Contenedores Completo**: Implementación de un panel de control para unidades de almacenamiento que permite:
    - Creación de nuevos contenedores con nomenclatura automática.
    - Cambio dinámico de tipo con regeneración de nombre técnico (manteniendo identidad única).
    - Borrado destructivo en cascada (elimina contenedor e ítems contenidos simultáneamente).
- **Funcionalidad de Actualización (Update)**: Implementacion completa del endpoint `PUT /api/items/{id}` para la modificacion integral de items y sus detalles, manteniendo la consistencia transaccional.
- **Estrategia de Detalle Extendida**: Evolucion del patron Strategy (`ItemDetalleHandler`) para incluir metodos de validacion y actualizacion polimorfica, permitiendo que cada tipo de hardware gestione su propio ciclo de vida.

### Removed
- **Sección de Parámetros**: Eliminación de la página unificada ParametersPage y remoción de sus enlaces en rutas y navegación sidebar para distribuir responsabilidades de forma limpia.

### Fixed
- **Modo Claro en Filtro de Puertos**: Corrección del estilo del buscador "Buscar puerto..." en [FilterSidebar.tsx](file:///C:/Users/User/Desktop/Proyectos/TechDepot/TechDepot/td-frontend/src/components/inventory/FilterSidebar.tsx), reemplazando el fondo oscuro fijo por la variable CSS `--input-bg-nested` para garantizar visibilidad óptima en modo claro.
- **Integridad en Protocolos**: El backend ahora crea automáticamente las capacidades de puerto necesarias al registrar nuevos protocolos, eliminando errores de claves foráneas.
- **Selección Multifunción y Protocolos**: Se corrigio la limitacion que impedia seleccionar multiples protocolos o funciones simultaneas en puertos con capacidades mixtas (ej: USB-A con Datos y Energia).
- **Logica Agnostica de Puertos**: Eliminacion de cualquier restriccion implicita que favoreciera al USB-C; ahora todos los puertos permiten seleccion multiple de protocolos segun su matriz de capacidades.
- **Estabilidad del Frontend**: Resolucion de conflictos de tipos en TypeScript y nombres de metodos inconsistentes en servicios.

### Changed
- **Visuales en Tabla sin Emojis**: Reemplazo del emoji de rayo (`⚡`) por un componente vectorial SVG `BoltIcon` en la tabla de inventario para las categorías de energía y protocolos de alimentación, mejorando la estética premium.
- **Documentación del Stack**: Actualización del archivo [README.md](file:///C:/Users/User/Desktop/Proyectos/TechDepot/TechDepot/README.md) para clarificar el rol de Hibernate como el motor ORM (Object-Relational Mapping) en el backend, diferenciándolo del rol de Spring Boot como framework web y de orquestación.
- **Branding del Sistema**: Integración del logo oficial en el Sidebar (agrandado 20%) y el icono de marca como Favicon del navegador.
- **Refactorización SOLID de Validaciones**: Las reglas de validacion especificas por tipo de hardware se movieron desde `ItemValidationService` hacia sus respectivos manejadores (`Strategy Pattern`), cumpliendo estrictamente con el principio de Abierto/Cerrado (OCP).
- **Optimización de Mapeo (Performance)**: Refactorizacion critica de `ItemDTOMapperService` para utilizar consultas con clausulas `IN` (`findByItemIdIn`) en lugar de `findAll()`. Esta mejora elimina escaneos completos de tablas y asegura la escalabilidad del sistema ante grandes volumenes de datos.
- **Manejo de Colores HEX**: Evolucion de la gestion de colores hacia un modelo hibrido que soporta codigos HEX directamente en la base de datos, permitiendo una personalizacion total por item.
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
- **Reordenamiento de Formulario de Items**: Se ha movido la seleccion del tipo de componente (Fuente, Cable, Hardware, Otro) al inicio del formulario para dictar el flujo de carga.
- **Logica de Filtrado Dinamico**:
    - **FUENTE**: Ahora restringe la seleccion de puertos y protocolos exclusivamente a aquellos con capacidad de Energia (ID 1). Pre-selecciona automaticamente la funcion de energia.
    - **CABLE**: Permite libertad total de puertos, eliminando restricciones previas de funciones de datos/video/audio.
    - **HARDWARE / OTRO**: Mantienen acceso a todo el catalogo de puertos para maxima flexibilidad hibrida.
    - **Soporte para Puertos "Dumb"**: Se corrigio el error que bloqueaba el guardado de puertos sin protocolos (ej: Schuko). Ahora, si un puerto tiene una unica funcion posible, se selecciona automaticamente; si tiene varias pero no usa protocolos, se habilita un selector manual de funcion.
- **Items Híbridos y Multifunción**: Se elimino la restriccion "Fatal" que obligaba a todas las conexiones de un item a tener la misma funcion. Ahora es posible crear items que combinen Video, Datos y Energia (ej: adaptadores USB-C a HDMI+PD).
- **Corrección de Mapeo de Protocolos**: Se habilito el soporte para guardar múltiples protocolos de diferentes categorías en un mismo puerto (ej: USB 3.0 para Datos y PD para Energía en el mismo USB-C), eliminando errores de integridad referencial.
- **Actualizacion de Directrices IA**: Se incorporaron reglas explicitas en `GEMINI.md` sobre el cierre de sesiones y limpieza de procesos en el puerto 8080.
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
