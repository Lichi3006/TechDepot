# Arquitectura de TechDepot - Backend

Este documento detalla las decisiones arquitectónicas y patrones de diseño implementados en el backend de TechDepot (Spring Boot).

## 1. Patrones de Diseño

### Facade Pattern (Capa de Servicio)
El servicio `ItemService` actúa como el punto de entrada principal (Fachada) para todas las operaciones relacionadas con el inventario. Su responsabilidad es **orquestar** la lógica delegando en servicios especializados para mantener el principio de responsabilidad única (SRP):
- `ItemValidationService`: Validaciones de integridad y existencia.
- `ItemCrudService`: Operaciones básicas de persistencia del item base.
- `ItemDetalleService`: Gestión de atributos específicos (Cables, Fuentes, Hardware).
- `ItemConexionService`: Lógica compleja de puertos y protocolos.

## 2. Estrategia de Persistencia y Modelado de Datos

### Modelo Relacional Estricto
Nuestra base de datos sigue una convención de nomenclatura rigurosa para facilitar la trazabilidad:
- **Tablas Maestras (`REF_`)**: Almacenan catálogos estáticos (ej: `REF_Marca`, `REF_Puerto`).
- **Tablas Puente (`LINK_`)**: Representan relaciones Muchos-a-Muchos explícitas (ej: `LINK_CategoriaHardware`). **PROHIBIDO** el uso de `@ManyToMany` implícito de JPA para asegurar control total sobre las consultas.

### Configuración de Hibernate (Control Manual)
Para evitar que JPA altere la estructura de SQL Server sin supervisión:
- `spring.jpa.hibernate.ddl-auto=none`: La base de datos es la "fuente de verdad". Los cambios se aplican mediante scripts SQL manuales.
- `PhysicalNamingStrategyStandardImpl`: Configurado para respetar el Case-Sensitivity de SQL Server.
- **Modo Fantasma**: En relaciones con FKs compuestas o redundantes, usamos `@JoinColumn(insertable = false, updatable = false)` junto con `ConstraintMode.NO_CONSTRAINT` para evitar que Hibernate intente validar restricciones que SQL Server ya gestiona.

## 3. Optimización y Rendimiento

### Prevención de N+1 Queries
El mapeo de entidades a DTOs en `ItemDTOMapperService` está optimizado para cargar todas las colecciones necesarias (Colores, Categorías, Conexiones) en una sola ráfaga de consultas controladas antes de procesar las listas, evitando el problema de rendimiento N+1.

### Eficiencia en Memoria y Tipos de Datos
- **IDs**: Siempre `Long` en Java y `BIGINT` en SQL para escalabilidad.
- **Métricas Eléctricas**: Uso de `Short` (objeto) en Java para soportar nulos, mapeados mediante `@Column(columnDefinition = "TINYINT")` o `SMALLINT` en SQL para minimizar el consumo de almacenamiento por registro.

## 4. Flujo de Datos
1. **Entrada**: `ItemCreateDTO` recibe IDs planos.
2. **Validación**: Se verifica la existencia de cada ID contra la BD.
3. **Persistencia**: Guardado secuencial y explícito (sin `CascadeType.ALL` en relaciones críticas).
4. **Salida**: `ItemDTO` devuelve objetos legibles con nombres y descripciones resueltas.
