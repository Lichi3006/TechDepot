CREATE DATABASE TechDepot;
GO

USE TechDepot;
GO

CREATE TABLE REF_Estado
(
    IdREF_Estado BIGINT IDENTITY(1,1),
    Nombre VARCHAR(20) UNIQUE NOT NULL,
    CONSTRAINT PK_RefEstado PRIMARY KEY (IdREF_Estado)
);

CREATE TABLE REF_Marca
(
    IdREF_Marca BIGINT IDENTITY(1,1),
    Nombre VARCHAR(20) UNIQUE NOT NULL,
    CONSTRAINT PK_RefMarca PRIMARY KEY (IdREF_Marca)
);

CREATE TABLE Contenedor
(
    IdContenedor BIGINT IDENTITY(1,1),
    QrUUID VARCHAR(36) UNIQUE NOT NULL,
    CONSTRAINT PK_Contenedor PRIMARY KEY (IdContenedor)
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

CREATE TABLE REF_CategoriaFuncion
(
    IdREF_CategoriaFuncion BIGINT IDENTITY(1,1),
    Nombre VARCHAR(20) UNIQUE NOT NULL,
    CONSTRAINT PK_RefCategoriaFuncion PRIMARY KEY (IdREF_CategoriaFuncion)
);

CREATE TABLE LINK_CategoriaFuncionItem
(
    IdLINK_CategoriaFuncionItem BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    IdREF_CategoriaFuncion BIGINT NOT NULL,
    CONSTRAINT PK_LinkCategoriaFuncionItem PRIMARY KEY (IdLINK_CategoriaFuncionItem),
    CONSTRAINT FK_LinkCategoriaFuncionItem_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem),
    CONSTRAINT FK_LinkCategoriaFuncionItem_RefCategoriaFuncion FOREIGN KEY (IdREF_CategoriaFuncion) REFERENCES REF_CategoriaFuncion (IdREF_CategoriaFuncion)
);

CREATE TABLE REF_Puerto
(
    IdREF_Puerto BIGINT IDENTITY(1,1),
    Nombre VARCHAR(36) UNIQUE NOT NULL,
    CONSTRAINT PK_RefPuerto PRIMARY KEY (IdREF_Puerto)
);

CREATE TABLE LINK_CategoriaFuncionPuerto
(
    IdLINK_CategoriaFuncionPuerto BIGINT IDENTITY(1,1),
    IdREF_CategoriaFuncion BIGINT NOT NULL,
    IdREF_Puerto BIGINT NOT NULL,
    CONSTRAINT PK_LinkCategoriaFuncionPuerto PRIMARY KEY (IdLINK_CategoriaFuncionPuerto),
    CONSTRAINT FK_LinkCategoriaFuncionPuerto_RefCategoriaFuncion FOREIGN KEY (IdREF_CategoriaFuncion) REFERENCES REF_CategoriaFuncion (IdREF_CategoriaFuncion),
    CONSTRAINT FK_LinkCategoriaFuncionPuerto_RefPuerto FOREIGN KEY (IdREF_Puerto) REFERENCES REF_Puerto (IdREF_Puerto)
);

CREATE TABLE LINK_ExtremoFisico
(
    IdLINK_ExtremoFisico BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    IdREF_Puerto BIGINT NOT NULL,
    Genero BIT NOT NULL,
    CONSTRAINT PK_LinkExtremoFisico PRIMARY KEY (IdLINK_ExtremoFisico),
    CONSTRAINT UQ_LinkExtremoFisico_RefPuerto UNIQUE (IdLINK_ExtremoFisico, IdREF_Puerto),
    CONSTRAINT FK_LinkExtremoFisico_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem),
    CONSTRAINT FK_LinkExtremoFisico_RefPuerto FOREIGN KEY (IdREF_Puerto) REFERENCES REF_Puerto (IdREF_Puerto)
);

CREATE TABLE REF_Protocolo
(
    IdREF_Protocolo BIGINT IDENTITY(1,1),
    IdREF_Puerto BIGINT NOT NULL,
    Nombre VARCHAR(36) UNIQUE NOT NULL,
    CONSTRAINT PK_RefProtocolo PRIMARY KEY (IdREF_Protocolo),
    CONSTRAINT UQ_RefProtocolo_RefPuerto UNIQUE (IdREF_Protocolo, IdREF_Puerto),
    CONSTRAINT FK_RefProtocolo_RefPuerto FOREIGN KEY (IdREF_Puerto) REFERENCES REF_Puerto (IdREF_Puerto)
);

CREATE TABLE LINK_ProtocoloDeExtremo
(
    IdLINK_ProtocoloDeExtremo BIGINT IDENTITY(1,1),
    IdLINK_ExtremoFisico BIGINT NOT NULL,
    IdREF_Protocolo BIGINT NOT NULL,
    IdREF_Puerto BIGINT NOT NULL,
    Genero BIT NOT NULL,
    CONSTRAINT PK_LinkProtocoloDeExtremo PRIMARY KEY (IdLINK_ProtocoloDeExtremo),
    CONSTRAINT FK_LinkProtocoloDeExtremo_RefProtocolo FOREIGN KEY (IdREF_Protocolo, IdREF_Puerto) REFERENCES REF_Protocolo (IdREF_Protocolo, IdREF_Puerto),
    CONSTRAINT FK_ProtExt_Extremo FOREIGN KEY (IdLINK_ExtremoFisico, IdREF_Puerto) REFERENCES LINK_ExtremoFisico (IdLINK_ExtremoFisico, IdREF_Puerto)
);

CREATE TABLE REF_CategoriaItem
(
    IdREF_CategoriaItem BIGINT IDENTITY(1,1),
    Nombre VARCHAR(36) UNIQUE NOT NULL,
    CONSTRAINT PK_RefCategoriaItem PRIMARY KEY (IdREF_CategoriaItem)
);

CREATE TABLE LINK_CategoriaItem
(
    IdLINK_CategoriaItem BIGINT IDENTITY(1,1),
    IdREF_CategoriaItem BIGINT NOT NULL,
    IdItem BIGINT NOT NULL,
    CONSTRAINT PK_LinkCategoriaItem PRIMARY KEY (IdLINK_CategoriaItem),
    CONSTRAINT FK_LinkCategoriaItem_RefCategoriaItem FOREIGN KEY (IdREF_CategoriaItem) REFERENCES REF_CategoriaItem (IdREF_CategoriaItem),
    CONSTRAINT FK_LinkCategoriaItem_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem)
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

CREATE TABLE DetalleCable
(
    IdDetalleCable BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    Largo INT NULL,
    IdREF_BlindajeExternoCable BIGINT NULL, 
    IdREF_BlindajeInternoCable BIGINT NULL, -- ¡Nuevo campo opcional!
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

CREATE TABLE REF_Color
(
    IdREF_Color BIGINT IDENTITY(1,1),
    Nombre VARCHAR(36) UNIQUE NOT NULL,
    CONSTRAINT PK_RefColor PRIMARY KEY (IdREF_Color)
);

CREATE TABLE Color
(
    IdColor BIGINT IDENTITY(1,1),
    IdItem BIGINT NOT NULL,
    IdREF_Color BIGINT NOT NULL,
    CONSTRAINT PK_Color PRIMARY KEY (IdColor),
    CONSTRAINT FK_Color_Item FOREIGN KEY (IdItem) REFERENCES Item (IdItem),
    CONSTRAINT FK_Color_RefColor FOREIGN KEY (IdREF_Color) REFERENCES REF_Color (IdREF_Color)
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

CREATE TABLE REF_CategoriaHardware
(
    IdREF_CategoriaHardware BIGINT IDENTITY(1,1),
    Nombre VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT PK_RefCategoriaHardware PRIMARY KEY (IdREF_CategoriaHardware)
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