# Arquitectura de TechDepot - Backend

Este documento detalla las decisiones arquitectónicas y patrones de diseño implementados en el backend de TechDepot (Spring Boot).

## 1. Patrones de Diseño

### Facade Pattern (Capa de Servicio)
El servicio `ItemService` actúa como el punto de entrada principal (Fachada) para todas las operaciones relacionadas con el inventario. Su responsabilidad es **orquestar** la lógica delegando en servicios especializados para mantener el principio de responsabilidad única (SRP):
- `ItemValidationService`: Validaciones de integridad y existencia.
- `ItemCrudService`: Operaciones básicas de persistencia del item base.
- `ItemDetalleService`: Gestión de atributos específicos (Cables, Fuentes, Hardware).
- `ItemConexionService`: Lógica compleja de puertos y protocolos.

## 2. Estrategia de Persistencia y Modelado de Datos (Evolución V2)

### El "Cerebro" de la DB: Inferencia de Categorías
A partir de la versión 2.0 del esquema, hemos eliminado la categorización manual de los items. El sistema ahora utiliza un modelo de **Categorización Inferida**:
- **Categoría por Función**: Cada extremo físico (`LINK_ExtremoFisico`) tiene una función obligatoria (Energía, Datos, Video, etc.).
- **Validación por Puerto**: Una tabla puente (`LINK_CategoriaFuncionPuerto`) actúa como "matriz de capacidades", impidiendo que un puerto (ej: Schuko) asuma funciones que no le corresponden físicamente.
- **Protocolos Coherentes**: Los protocolos ahora están vinculados a funciones específicas. No se puede asignar un protocolo de "Video" a un extremo declarado como "Datos".

### Mapeo Avanzado de JPA: Ghost Mode
Para soportar las restricciones de integridad compuestas de SQL Server (donde una columna como `IdREF_Puerto` es parte de múltiples FKs), implementamos el **"Ghost Mode"**:
- Se utilizan relaciones simples `@ManyToOne` para la navegación de objetos.
- Las columnas de validación redundantes exigidas por la DB (ej: `IdREF_Puerto`, `IdREF_CategoriaFuncion`) se mapean como propiedades `@Column` básicas.
- Estas propiedades se pueblan manualmente en la capa de Servicio (`ItemConexionService`) antes de persistir, asegurando coherencia sin confundir al motor de mapeo de Hibernate con llaves compuestas complejas.
- Se desactiva la validación de Hibernate mediante `foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT)`, delegando la responsabilidad total de la integridad al motor de base de datos SQL Server.

## 3. Logística y Trazabilidad Física

### Nomenclatura Estándar de Contenedores
Para facilitar la búsqueda física de hardware, el sistema implementa una convención de nombres automática y jerárquica:
- **Catálogo de Tipos**: La tabla `REF_TipoContenedor` define los prefijos oficiales (ej: `DAT` para Datos, `PWR` para Energía).
- **Algoritmo de Generación**: El `ContenedorService` orquesta la creación siguiendo el patrón `[PREFIJO]-[SECUENCIA]-[UUID_CORTO]`.
  - **Secuencia**: Se calcula mediante un conteo en tiempo real de contenedores del mismo tipo, asegurando un orden lógico (01, 02, 03...).
  - **Entropía de Seguridad**: Se adjuntan los últimos 4 caracteres del UUID para garantizar que, incluso ante colisiones teóricas o borrados, cada etiqueta física sea única e irrepetible.

## 4. Optimización y Rendimiento

### Prevención de N+1 Queries
El mapeo de entidades a DTOs en `ItemDTOMapperService` está optimizado para cargar todas las colecciones necesarias en una sola ráfaga de consultas controladas. La inferencia de categorías se realiza mediante lógica de Streams de Java para replicar la eficiencia de la vista SQL.

## 4. Flujo de Datos
1. **Entrada**: `ItemCreateDTO` recibe IDs planos y definiciones de funciones por conexión.
2. **Validación**: `ItemValidationService` actúa como "policía", verificando que cada conexión tenga su función y que las referencias existan.
3. **Persistencia**: Guardado secuencial y explícito (sin `CascadeType.ALL`).
4. **Salida**: `ItemDTO` devuelve la `categoriaCalculada` (inferida) y detalles resueltos.
