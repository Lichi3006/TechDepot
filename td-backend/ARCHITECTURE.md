# Arquitectura de TechDepot - Backend

Este documento detalla las decisiones arquitectónicas y patrones de diseño implementados en el backend de TechDepot (Spring Boot).

## 1. Patrones de Diseño

### Facade Pattern (Capa de Servicio)
El servicio ItemService actúa como el punto de entrada principal (Fachada) para todas las operaciones relacionadas con el inventario. Su responsabilidad es orquestar la lógica delegando en servicios especializados para mantener el principio de responsabilidad única (SRP):
- ItemValidationService: Validaciones de integridad y existencia.
- ItemCrudService: Operaciones básicas de persistencia del item base.
- `ItemDetalleService`: Gestión de atributos comunes (Colores).
- `ItemConexionService`: Lógica compleja de puertos y protocolos.
- `ItemDetalleHandler` (Strategy Pattern): Manejo polimórfico de validación, persistencia, actualización y eliminación de detalles específicos (Cables, Fuentes, Hardware).

## 2. Estrategia de Persistencia y Modelado de Datos (Evolución V2)

### El Cerebro de la DB: Inferencia de Categorías
A partir de la versión 2.0 del esquema, hemos eliminado la categorización manual de los items. El sistema ahora utiliza un modelo de Categorización Inferida:
- Categoría por Función: Cada extremo físico (LINK_ExtremoFisico) tiene una función obligatoria (Energía, Datos, Video, etc.).
- Validación por Puerto: Una tabla puente (LINK_CategoriaFuncionPuerto) actúa como "matriz de capacidades", impidiendo que un puerto (ej: Schuko) asuma funciones que no le corresponden físicamente.
- Protocolos Coherentes: Los protocolos ahora están vinculados a funciones específicas. No se puede asignar un protocolo de "Video" a un extremo declarado como "Datos".

### Mapeo Avanzado de JPA: Ghost Mode
Para soportar las restricciones de integridad compuestas de SQL Server (donde una columna como IdREF_Puerto es parte de múltiples FKs), implementamos el "Ghost Mode":
- Se utilizan relaciones simples @ManyToOne para la navegación de objetos.
- Las columnas de validación redundantes exigidas por la DB (ej: IdREF_Puerto, IdREF_CategoriaFuncion) se mapean como propiedades @Column básicas.
- Estas propiedades se pueblan manualmente en la capa de Servicio (ItemConexionService) antes de persistir, asegurando coherencia sin confundir al motor de mapeo de Hibernate con llaves compuestas complejas.
- Se desactiva la validación de Hibernate mediante foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT), delegando la responsabilidad total de la integridad al motor de base de datos SQL Server.

## 3. Logística y Trazabilidad Física

### Nomenclatura Estándar de Contenedores
Para facilitar la búsqueda física de hardware, el sistema implementa una convención de nombres automática y jerárquica:
- Catálogo de Tipos: La tabla REF_TipoContenedor define los prefijos oficiales (ej: DAT para Datos, PWR para Energía).
- Algoritmo de Generación: El ContenedorService orquesta la creación siguiendo el patrón [PREFIJO]-[SECUENCIA]-[UUID_CORTO].
  - Secuencia: Se calcula mediante un conteo en tiempo real de contenedores del mismo tipo, asegurando un orden lógico (01, 02, 03...).
  - Entropía de Seguridad: Se adjuntan los últimos 4 caracteres del UUID para garantizar que, incluso ante colisiones teóricas o borrados, cada etiqueta física sea única e irrepetible.

## 4. Optimización y Rendimiento

### Prevención de N+1 Queries y Escalabilidad
El mapeo de entidades a DTOs en ItemDTOMapperService está optimizado para evitar el problema de N+1 queries mediante ráfagas de consultas controladas:
- Consultas con Cláusula IN: Para listados generales, el mapeador extrae los IDs de los items y realiza consultas quirúrgicas utilizando `findByItemIdIn(List<Long> ids)`. Esto evita tanto las consultas individuales (N+1) como los escaneos completos de tablas (`findAll()`), garantizando un uso eficiente de la memoria y la CPU.
### Inferencia en Memoria: El cálculo de la categoría se realiza mediante lógica de Java Streams sobre los datos precargados, replicando la eficiencia de una vista SQL sin la sobrecarga de múltiples joins en el servidor de DB.

## 5. Gestión de Infraestructura y Ciclo de Vida

### Administración de la Matriz de Capacidades
El sistema expone módulos administrativos para gestionar la infraestructura física del inventario de forma dinámica:
- **Gestión de Puertos y Protocolos:** Permite definir nuevos estándares físicos y sus capacidades lógicas (Energía, Datos, etc.) sin modificar el código. El backend asegura la integridad creando automáticamente las relaciones en la matriz de capacidades (`LINK_CategoriaFuncionPuerto`) al registrar nuevos protocolos.
- **Ciclo de Vida de Contenedores:** Los contenedores soportan cambios de tipo en caliente. Al cambiar el tipo (ej: de Datos a Redes), el sistema regenera el nombre técnico siguiendo la secuencia oficial pero conserva la identidad única (UUID), permitiendo la reutilización de etiquetas físicas.

### Cascada Manual y Limpieza de Datos
En cumplimiento con la regla de **No CascadeType.ALL**, el sistema implementa una política de "Borrado Destructivo Controlado" en la capa de servicio:
- **Eliminación de Contenedores:** Al eliminar un contenedor, el `ContenedorService` orquesta la destrucción de todo su contenido. Itera sobre los items asociados y llama al `ItemService.deleteItemById`, asegurando que cada componente sea purgado de todas las tablas relacionadas (colores, conexiones, detalles técnicos) antes de eliminar el registro del contenedor. Esto previene la existencia de registros huérfanos y mantiene la base de datos limpia.

### Validación de Eliminación y Consistencia de Catálogos (Safe Deletes)
Para evitar violaciones de integridad referencial en SQL Server, la capa de servicio valida que las entidades maestras de catálogo no estén en uso en el inventario antes de permitir su eliminación física:
- **Puertos:** El `RefPuertoService` elimina en cascada las capacidades y protocolos asociados si y solo si el puerto no está en uso en ninguna conexión física (`LINK_ExtremoFisico`). Si está en uso, aborta el flujo arrojando una excepción de negocio.
- **Protocolos:** El `RefProtocoloService` valida mediante `LinkProtocoloDeExtremoRepository.existsByProtocoloId` que el protocolo no esté asociado a conexiones lógicas de hardware en stock.
- **Marcas:** El `RefMarcaService` utiliza `ItemRepository.existsByMarcaId` para garantizar que ningún ítem dependa de la marca a eliminar.
- **Categorías de Hardware:** El `RefCategoriaHardwareService` utiliza `LinkCategoriaHardwareRepository.existsByRefCategoriaHardwareId` para proteger la eliminación de clasificaciones asociadas a detalles de hardware.
- **Blindajes de Cable:** Los servicios `RefBlindajeExternoCableService` y `RefBlindajeInternoCableService` validan a través del `DetalleCableRepository` (`existsByBlindajeExternoId` y `existsByBlindajeInternoId`) que el preset no esté asignado a ningún cable del inventario.

## 6. Flujo de Datos
1. Entrada: ItemCreateDTO recibe IDs planos y definiciones de funciones por conexión.
2. Validación: ItemValidationService actúa como "policía", verificando que cada conexión tenga su función y que las referencias existan.
3. Persistencia: Guardado secuencial y explícito (sin CascadeType.ALL).
4. Salida: ItemDTO devuelve la categoriaCalculada (inferida) y detalles resueltos.

