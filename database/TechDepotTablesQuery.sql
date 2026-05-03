CREATE DATABASE TechDepot;
GO

USE TechDepot;
GO

-- =============================================
-- 1. TABLAS MAESTRAS (CATÁLOGOS)
-- =============================================

CREATE TABLE REF_Estado
(
    IdREF_Estado BIGINT IDENTITY(1,1),
    Nombre VARCHAR(20) UNIQUE NOT NULL,
    CONSTRAINT PK_RefEstado PRIMARY KEY (IdREF_Estado)
);

CREATE TABLE REF_Marca
(
    IdREF_Marca BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefMarca PRIMARY KEY (IdREF_Marca)
);

CREATE TABLE REF_CategoriaFuncion
(
    IdREF_CategoriaFuncion BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefCategoriaFuncion PRIMARY KEY (IdREF_CategoriaFuncion)
);

CREATE TABLE REF_Puerto
(
    IdREF_Puerto BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefPuerto PRIMARY KEY (IdREF_Puerto)
);

CREATE TABLE REF_Color
(
    IdREF_Color BIGINT IDENTITY(1,1),
    Nombre VARCHAR(36) UNIQUE NOT NULL,
    CONSTRAINT PK_RefColor PRIMARY KEY (IdREF_Color)
);

CREATE TABLE REF_BlindajeExternoCable
(
    IdREF_BlindajeExternoCable BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefBlindajeExternoCable PRIMARY KEY (IdREF_BlindajeExternoCable)
);

CREATE TABLE REF_BlindajeInternoCable
(
    IdREF_BlindajeInternoCable BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefBlindajeInternoCable PRIMARY KEY (IdREF_BlindajeInternoCable)
);

CREATE TABLE REF_CategoriaHardware
(
    IdREF_CategoriaHardware BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefCategoriaHardware PRIMARY KEY (IdREF_CategoriaHardware)
);

CREATE TABLE REF_TipoContenedor
(
    IdREF_TipoContenedor BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL, -- Ej: 'Cables de Datos'
    Prefijo VARCHAR(5) UNIQUE NOT NULL,  -- Ej: 'DAT'
    CONSTRAINT PK_RefTipoContenedor PRIMARY KEY (IdREF_TipoContenedor)
);

-- =============================================
-- 2. CAPACIDADES DE LOS PUERTOS Y PROTOCOLOS
-- =============================================

CREATE TABLE LINK_CategoriaFuncionPuerto
(
    IdREF_Puerto BIGINT NOT NULL,
    IdREF_CategoriaFuncion BIGINT NOT NULL,
    CONSTRAINT PK_LinkCategoriaFuncionPuerto PRIMARY KEY (IdREF_Puerto, IdREF_CategoriaFuncion),
    CONSTRAINT FK_LCFP_Puerto FOREIGN KEY (IdREF_Puerto) REFERENCES REF_Puerto (IdREF_Puerto),
    CONSTRAINT FK_LCFP_Funcion FOREIGN KEY (IdREF_CategoriaFuncion) REFERENCES REF_CategoriaFuncion (IdREF_CategoriaFuncion)
);

CREATE TABLE REF_Protocolo
(
    IdREF_Protocolo BIGINT IDENTITY(1,1),
    IdREF_Puerto BIGINT NOT NULL,
    IdREF_CategoriaFuncion BIGINT NOT NULL,
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefProtocolo PRIMARY KEY (IdREF_Protocolo),
    CONSTRAINT UQ_RefProtocolo_PuertoFuncion UNIQUE (IdREF_Protocolo, IdREF_Puerto, IdREF_CategoriaFuncion),
    CONSTRAINT FK_RefProtocolo_LCFP FOREIGN KEY (IdREF_Puerto, IdREF_CategoriaFuncion) 
        REFERENCES LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion)
);

-- =============================================
-- 3. ENTIDADES PRINCIPALES
-- =============================================

CREATE TABLE Contenedor
(
    IdContenedor BIGINT IDENTITY(1,1),
    IdREF_TipoContenedor BIGINT NOT NULL,
    QrUUID VARCHAR(36) UNIQUE NOT NULL,
    Nombre VARCHAR(100) NULL,
    CONSTRAINT PK_Contenedor PRIMARY KEY (IdContenedor),
    CONSTRAINT FK_Contenedor_RefTipoContenedor FOREIGN KEY (IdREF_TipoContenedor) REFERENCES REF_TipoContenedor (IdREF_TipoContenedor)
);

CREATE TABLE Item
(
    IdItem BIGINT IDENTITY(1,1),
    IdREF_Estado BIGINT NOT NULL,
    IdREF_Marca BIGINT NULL,
    IdContenedor BIGINT NOT NULL,
    CONSTRAINT PK_Item PRIMARY KEY (IdItem),
    CONSTRAINT FK_Item_RefEstado FOREIGN KEY (IdREF_Estado) REFERENCES REF_Estado (IdREF_Estado),
    CONSTRAINT FK_Item_RefMarca FOREIGN KEY (IdREF_Marca) REFERENCES REF_Marca (IdREF_Marca),
    CONSTRAINT FK_Item_Contenedor FOREIGN KEY (IdContenedor) REFERENCES Contenedor (IdContenedor)
);

-- =============================================
-- 4. RELACIONES MUCHOS A MUCHOS (LINKs)
-- =============================================

CREATE TABLE Color
(
    IdColor BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    IdREF_Color BIGINT NOT NULL,
    CONSTRAINT PK_Color PRIMARY KEY (IdColor),
    CONSTRAINT FK_Color_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem),
    CONSTRAINT FK_Color_RefColor FOREIGN KEY (IdREF_Color) REFERENCES REF_Color (IdREF_Color)
);

-- =============================================
-- 5. CONEXIONES Y EXTREMOS (LÓGICA INTELIGENTE)
-- =============================================

CREATE TABLE LINK_ExtremoFisico
(
    IdLINK_ExtremoFisico BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    IdREF_Puerto BIGINT NOT NULL,
    IdREF_CategoriaFuncion BIGINT NOT NULL,
    Genero BIT NOT NULL,
    CONSTRAINT PK_LinkExtremoFisico PRIMARY KEY (IdLINK_ExtremoFisico),
    CONSTRAINT FK_LinkExtremoFisico_LCFP FOREIGN KEY (IdREF_Puerto, IdREF_CategoriaFuncion) 
        REFERENCES LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion),
    CONSTRAINT FK_LinkExtremoFisico_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem),
    CONSTRAINT UQ_LinkExtremoFisico_Validacion UNIQUE (IdLINK_ExtremoFisico, IdREF_Puerto, IdREF_CategoriaFuncion)
);

CREATE TABLE LINK_ProtocoloDeExtremo
(
    IdLINK_ProtocoloDeExtremo BIGINT IDENTITY(1,1),
    IdLINK_ExtremoFisico BIGINT NOT NULL,
    IdREF_Puerto BIGINT NOT NULL,
    IdREF_CategoriaFuncion BIGINT NOT NULL,
    IdREF_Protocolo BIGINT NOT NULL,
    CONSTRAINT PK_LinkProtocoloDeExtremo PRIMARY KEY (IdLINK_ProtocoloDeExtremo),
    CONSTRAINT FK_LPDE_Protocolo FOREIGN KEY (IdREF_Protocolo, IdREF_Puerto, IdREF_CategoriaFuncion)
        REFERENCES REF_Protocolo (IdREF_Protocolo, IdREF_Puerto, IdREF_CategoriaFuncion),
    CONSTRAINT FK_LPDE_Extremo FOREIGN KEY (IdLINK_ExtremoFisico, IdREF_Puerto, IdREF_CategoriaFuncion)
        REFERENCES LINK_ExtremoFisico (IdLINK_ExtremoFisico, IdREF_Puerto, IdREF_CategoriaFuncion)
);

-- =============================================
-- 6. DETALLES ESPECÍFICOS (MANTENIDOS DE V1)
-- =============================================

CREATE TABLE DetalleCable
(
    IdDetalleCable BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    Largo INT NULL,
    IdREF_BlindajeExternoCable BIGINT NULL, 
    IdREF_BlindajeInternoCable BIGINT NULL,
    CONSTRAINT PK_DetalleCable PRIMARY KEY (IdDetalleCable),
    CONSTRAINT FK_DetalleCable_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem),
    CONSTRAINT FK_DetalleCable_RefBlindajeExterno FOREIGN KEY (IdREF_BlindajeExternoCable) REFERENCES REF_BlindajeExternoCable (IdREF_BlindajeExternoCable),
    CONSTRAINT FK_DetalleCable_RefBlindajeInterno FOREIGN KEY (IdREF_BlindajeInternoCable) REFERENCES REF_BlindajeInternoCable (IdREF_BlindajeInternoCable)
);

CREATE TABLE DetalleAlimentacionCable
(
    IdDetalleCable BIGINT NOT NULL, 
    AmperajeMax TINYINT NOT NULL,
    CONSTRAINT PK_DetalleAlimentacionCable PRIMARY KEY (IdDetalleCable),
    CONSTRAINT FK_DetalleAlimentacionCable_DetalleCable FOREIGN KEY (IdDetalleCable) REFERENCES DetalleCable (IdDetalleCable)
);

CREATE TABLE DetalleFuente
(
    IdDetalleFuente BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    Amperaje TINYINT NOT NULL,
    Voltaje SMALLINT NOT NULL,
    CONSTRAINT PK_DetalleFuente PRIMARY KEY (IdDetalleFuente),
    CONSTRAINT FK_DetalleFuente_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem)
);

CREATE TABLE DetalleHardware
(
    IdDetalleHardware BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    ModeloAlfanumerico VARCHAR(100) NULL,
    CONSTRAINT PK_DetalleHardware PRIMARY KEY (IdDetalleHardware),
    CONSTRAINT FK_DetalleHardware_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem)
);

CREATE TABLE LINK_CategoriaHardware
(
    IdLINK_CategoriaHardware BIGINT IDENTITY(1,1),
    IdDetalleHardware BIGINT NOT NULL,
    IdREF_CategoriaHardware BIGINT NOT NULL,
    CONSTRAINT PK_LinkCategoriaHardware PRIMARY KEY (IdLINK_CategoriaHardware),
    CONSTRAINT FK_LinkCatHard_Detalle FOREIGN KEY (IdDetalleHardware) REFERENCES DetalleHardware (IdDetalleHardware),
    CONSTRAINT FK_LinkCatHard_Ref FOREIGN KEY (IdREF_CategoriaHardware) REFERENCES REF_CategoriaHardware (IdREF_CategoriaHardware)
);

-- =============================================
-- 7. VISTAS Y UTILIDADES (INFERENCIA DE CATEGORÍA)
-- =============================================
GO

CREATE VIEW v_InventarioDetallado AS
SELECT 
    i.IdItem,
    m.Nombre as Marca,
    e.Nombre as Estado,
    cont.Nombre as Contenedor,
    (SELECT STRING_AGG(cf.Nombre, ' + ') WITHIN GROUP (ORDER BY cf.Nombre)
     FROM (SELECT DISTINCT IdREF_CategoriaFuncion FROM LINK_ExtremoFisico WHERE IdItem = i.IdItem) distinct_cf
     JOIN REF_CategoriaFuncion cf ON distinct_cf.IdREF_CategoriaFuncion = cf.IdREF_CategoriaFuncion
    ) as CategoriaCalculada
FROM Item i
LEFT JOIN REF_Marca m ON i.IdREF_Marca = m.IdREF_Marca
JOIN REF_Estado e ON i.IdREF_Estado = e.IdREF_Estado
JOIN Contenedor cont ON i.IdContenedor = cont.IdContenedor;
GO

-- =============================================
-- 8. ÍNDICES DE RENDIMIENTO (OPTIMIZACIÓN)
-- =============================================

-- Índices en tablas LINK y DETALLE para acelerar búsquedas por Item
CREATE INDEX IX_LINK_ExtremoFisico_Item ON LINK_ExtremoFisico (IdItem);
CREATE INDEX IX_LINK_ProtocoloDeExtremo_Extremo ON LINK_ProtocoloDeExtremo (IdLINK_ExtremoFisico);
CREATE INDEX IX_Color_Item ON Color (IdItem);
CREATE INDEX IX_DetalleCable_Item ON DetalleCable (IdItem);
CREATE INDEX IX_DetalleFuente_Item ON DetalleFuente (IdItem);
CREATE INDEX IX_DetalleHardware_Item ON DetalleHardware (IdItem);

-- Índices en tablas maestras para búsquedas frecuentes
CREATE INDEX IX_REF_Protocolo_Puerto ON REF_Protocolo (IdREF_Puerto);
GO
