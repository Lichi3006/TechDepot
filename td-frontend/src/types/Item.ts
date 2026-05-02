export interface Item {
    id: number;
    marca: string;
    estado: string;
    contenedor: string;
    color: string[]; // En el backend es una lista
    categorias: Categorias;
    conexiones: Conexion[];
    especificaciones: Especificaciones;
    proteccion?: Proteccion;
}

export interface Categorias {
    categoriaItem: string[];
    categoriaPuerto: string[];
    categoriaHardware: string[];
}

export interface Conexion {
    puerto: string;
    protocolo: string[];
    genero: boolean;
}

export interface Especificaciones {
    largo?: number;
    voltaje?: number;
    amperaje?: number;
    amperajeMax?: number;
    modelo?: string;
}

export interface Proteccion {
    blindajeExterno?: string;
    blindajeInterno?: string;
}

// DTO para enviar al backend (Creación)
export interface ItemCreateDTO {
    idEstado: number;
    idMarca?: number;
    idContenedor: number;
    idsColores: number[];
    idsCategoriasItem: number[];
    conexiones: ConexionCreateDTO[];
    detalleCable?: DetalleCableCreateDTO;
    detalleFuente?: DetalleFuenteCreateDTO;
    detalleHardware?: DetalleHardwareCreateDTO;
}

export interface ConexionCreateDTO {
    idPuerto: number;
    genero: boolean;
    idsProtocolos: number[];
}

export interface DetalleCableCreateDTO {
    largo: number;
    idBlindajeExterno: number;
    idBlindajeInterno?: number;
    amperajeMax?: number;
}

export interface DetalleFuenteCreateDTO {
    amperaje: number;
    voltaje: number;
}

export interface DetalleHardwareCreateDTO {
    modeloAlfanumerico: string;
    idsCategoriasHardware: number[];
}
