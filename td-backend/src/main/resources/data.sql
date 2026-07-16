-- =============================================
-- 9. DATOS SEMILLA (SEED DATA)
-- Datos bÃ¡sicos para que el sistema "inteligente" pueda funcionar desde cero.
-- =============================================

-- 9.1 Estados BÃ¡sicos
INSERT INTO REF_Estado (Nombre) VALUES 
('Nuevo'), 
('Usado - Buen estado'), 
('Usado - Desgaste'), 
('Roto / Para reparar');

-- 9.2 CategorÃ­as de FunciÃ³n (El motor lÃ³gico)
-- IMPORTANTE: El orden de inserciÃ³n define el ID (1=EnergÃ­a, 2=Datos, 3=Video, 4=Audio)
INSERT INTO REF_CategoriaFuncion (Nombre) VALUES 
('EnergÃ­a'), 
('Datos'), 
('Video'), 
('Audio'),
('Redes');

-- 9.3 Tipos de Contenedor
INSERT INTO REF_TipoContenedor (Nombre, Prefijo) VALUES 
('Cables de Datos y Red', 'DAT'),
('Cables y Fuentes de Poder', 'PWR'),
('Cables de Video y Audio', 'VID'),
('Equipamiento de Red', 'NET'),
('Hardware General', 'HDW'),
('Mixto / Varios', 'MIX');

-- 9.3.1 CategorÃ­as de Hardware
INSERT INTO REF_CategoriaHardware (Nombre) VALUES
('Disco Duro (HDD/SSD)'),
('Memoria RAM'),
('Placa Madre (Motherboard)'),
('Placa de Video (GPU)'),
('Procesador (CPU)'),
('Gabinete / Chasis'),
('Fuente de AlimentaciÃ³n (PSU)'),
('Disipador / Cooler'),
('Tarjeta de Red (NIC)'),
('Placa de Sonido');

-- 9.3.2 Marcas Comunes
INSERT INTO REF_Marca (Nombre) VALUES
('Intel'),
('AMD'),
('NVIDIA'),
('ASUS'),
('Gigabyte'),
('MSI'),
('Corsair'),
('Kingston'),
('Western Digital'),
('Seagate'),
('TP-Link'),
('Samsung'),
('Logitech'),
('Dell'),
('HP'),
('Lenovo');


-- 9.4 Puertos FÃ­sicos Comunes
INSERT INTO REF_Puerto (Nombre) VALUES 
('USB-C'), 
('USB-A'), 
('HDMI'), 
('DisplayPort'), 
('Schuko (Pared)'), 
('IEC C13 (Fuente PC)'),
('RJ45'),
('Jack 3.5mm (TRS)'),
('Jack 6.35mm (Instrumento)'),
('XLR (Canon)'),
('Enchufe Pared Arg (Tipo I)');

-- 9.5 Capacidades de los Puertos (La matriz de inteligencia)
-- USB-C (1) -> EnergÃ­a (1), Datos (2), Video (3)
INSERT INTO LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion) VALUES (1, 1), (1, 2), (1, 3);
-- USB-A (2) -> EnergÃ­a (1), Datos (2)
INSERT INTO LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion) VALUES (2, 1), (2, 2);
-- HDMI (3) y DP (4) -> Video (3), Audio (4)
INSERT INTO LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion) VALUES (3, 3), (3, 4), (4, 3), (4, 4);
-- Schuko (5) e IEC C13 (6) -> EnergÃ­a (1)
INSERT INTO LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion) VALUES (5, 1), (6, 1);
-- RJ45 (7) -> Redes (5)
INSERT INTO LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion) VALUES (7, 5);
-- Jacks y XLR (8, 9, 10) -> Audio (4)
INSERT INTO LINK_CategoriaFuncionPuerto (IdREF_Puerto, IdREF_CategoriaFuncion) VALUES (8, 4), (9, 4), (10, 4);

-- 9.6 Protocolos para Puertos Complejos
-- USB-C
INSERT INTO REF_Protocolo (IdREF_Puerto, IdREF_CategoriaFuncion, Nombre) VALUES 
(1, 2, 'USB 2.0'), (1, 2, 'USB 3.0 (5Gbps)'), (1, 2, 'USB 3.1 (10Gbps)'), (1, 2, 'USB 3.2 Gen 2x2 (20Gbps)'), (1, 2, 'USB4 (40Gbps)'),
(1, 2, 'Thunderbolt 3'), (1, 2, 'Thunderbolt 4'), (1, 3, 'DisplayPort Alt Mode'), (1, 1, 'Power Delivery (PD) 60W'), (1, 1, 'Power Delivery (PD) 100W');
-- USB-A
INSERT INTO REF_Protocolo (IdREF_Puerto, IdREF_CategoriaFuncion, Nombre) VALUES (2, 2, 'USB 1.1'), (2, 2, 'USB 2.0'), (2, 2, 'USB 3.0 (Superspeed)'), (2, 2, 'USB 3.1 Gen 2');
-- HDMI
INSERT INTO REF_Protocolo (IdREF_Puerto, IdREF_CategoriaFuncion, Nombre) VALUES (3, 3, 'HDMI 1.4'), (3, 3, 'HDMI 2.0'), (3, 3, 'HDMI 2.1');
-- DisplayPort
INSERT INTO REF_Protocolo (IdREF_Puerto, IdREF_CategoriaFuncion, Nombre) VALUES (4, 3, 'DisplayPort 1.2'), (4, 3, 'DisplayPort 1.4'), (4, 3, 'DisplayPort 2.0'), (4, 3, 'DisplayPort 2.1');
-- RJ45 (Ethernet) - Ahora bajo categorÃ­a Redes (5)
INSERT INTO REF_Protocolo (IdREF_Puerto, IdREF_CategoriaFuncion, Nombre) VALUES (7, 5, 'Ethernet Cat5 (100Mbps)'), (7, 5, 'Ethernet Cat5e (1Gbps)'), (7, 5, 'Ethernet Cat6 (1Gbps)'), (7, 5, 'Ethernet Cat6a (10Gbps)'), (7, 5, 'Ethernet Cat7 (10Gbps)');
-- Audio (Jacks / XLR)
INSERT INTO REF_Protocolo (IdREF_Puerto, IdREF_CategoriaFuncion, Nombre) VALUES (8, 4, 'Audio Analogo (Stereo)'), (9, 4, 'Audio Analogo (Mono/Instrumento)'), (10, 4, 'Audio Balanceado (Mono)');

-- 9.7 Colores Comunes (Presets)
INSERT INTO REF_Color (CodigoHex) VALUES 
('#000000'),
('#FFFFFF'),
('#808080'),
('#FF0000'),
('#0000FF'),
('#00FF00'),
('#FFFF00'),
('#FFA500'),
('#8A2BE2'),
('#FFC0CB');

-- 9.8 Blindajes
INSERT INTO REF_BlindajeExternoCable (Nombre) VALUES ('PVC'), ('Trenzado Nylon'), ('Goma'), ('UTP (Sin blindaje)'), ('STP (Blindaje trenzado)'), ('FTP (LÃ¡mina aluminio)');
INSERT INTO REF_BlindajeInternoCable (Nombre) VALUES ('Ninguno'), ('Papel Aluminio (Foil)'), ('Trenzado Cobre');
