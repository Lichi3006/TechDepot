import api from './api';
import type { 
    RefMarca, 
    RefEstado, 
    RefColor, 
    RefTipoContenedor,
    Contenedor, 
    RefCategoriaFuncion, 
    RefPuerto, 
    RefProtocolo,
    LinkPuertoCapacidad,
    RefBase
} from '../types/Item.ts';

export const refService = {
    // Marcas
    getMarcas: () => api.get<RefMarca[]>('/marcas').then(r => r.data),
    saveMarca: (data: RefMarca) => api.post<RefMarca>('/marcas', data).then(r => r.data),
    deleteMarca: (id: number) => api.delete(`/marcas/${id}`),

    // Estados
    getEstados: () => api.get<RefEstado[]>('/estados').then(r => r.data),
    saveEstado: (data: RefEstado) => api.post<RefEstado>('/estados', data).then(r => r.data),

    // Colores
    getColores: () => api.get<RefColor[]>('/colores').then(r => r.data),
    saveColor: (data: RefColor) => api.post<RefColor>('/colores', data).then(r => r.data),

    // Contenedores
    getContenedores: () => api.get<Contenedor[]>('/contenedores').then(r => r.data),
    saveContenedor: (data: any) => api.post<Contenedor>('/contenedores', data).then(r => r.data),
    updateContenedor: (id: number, data: any) => api.put<Contenedor>(`/contenedores/${id}`, data).then(r => r.data),
    deleteContenedor: (id: number) => api.delete(`/contenedores/${id}`),

    // Tipos de Contenedor
    getTiposContenedor: () => api.get<RefTipoContenedor[]>('/tipos-contenedor').then(r => r.data),
    saveTipoContenedor: (data: RefTipoContenedor) => api.post<RefTipoContenedor>('/tipos-contenedor', data).then(r => r.data),

    // Categorías de Función
    getCategoriasFuncion: () => api.get<RefCategoriaFuncion[]>('/categorias-funcion').then(r => r.data),
    saveCategoriaFuncion: (data: RefCategoriaFuncion) => api.post<RefCategoriaFuncion>('/categorias-funcion', data).then(r => r.data),

    // Puertos
    getPuertos: () => api.get<RefPuerto[]>('/puertos').then(r => r.data),
    savePuerto: (data: RefPuerto) => api.post<RefPuerto>('/puertos', data).then(r => r.data),
    deletePuerto: (id: number) => api.delete(`/puertos/${id}`),
    getPuertosCapacidades: () => api.get<LinkPuertoCapacidad[]>('/puertos-capacidades').then(r => r.data),
    savePuertoCapacidad: (idPuerto: number, idFuncion: number) => api.post('/puertos-capacidades', { 
        puerto: { id: idPuerto }, 
        categoriaFuncion: { id: idFuncion } 
    }).then(r => r.data),

    // Categorías de Hardware
    getCategoriasHardware: () => api.get<RefBase[]>('/categorias-hardware').then(r => r.data),
    saveCategoriaHardware: (data: RefBase) => api.post<RefBase>('/categorias-hardware', data).then(r => r.data),
    deleteCategoriaHardware: (id: number) => api.delete(`/categorias-hardware/${id}`),

    // Blindajes
    getBlindajesExternos: () => api.get<RefBase[]>('/blindajes-externos').then(r => r.data),
    saveBlindajeExterno: (data: RefBase) => api.post<RefBase>('/blindajes-externos', data).then(r => r.data),
    deleteBlindajeExterno: (id: number) => api.delete(`/blindajes-externos/${id}`),

    getBlindajesInternos: () => api.get<RefBase[]>('/blindajes-internos').then(r => r.data),
    saveBlindajeInterno: (data: RefBase) => api.post<RefBase>('/blindajes-internos', data).then(r => r.data),
    deleteBlindajeInterno: (id: number) => api.delete(`/blindajes-internos/${id}`),

    // Protocolos
    getProtocolos: () => api.get<RefProtocolo[]>('/protocolos').then(r => r.data),
    saveProtocolo: (data: RefProtocolo) => api.post<RefProtocolo>('/protocolos', data).then(r => r.data),
    deleteProtocolo: (id: number) => api.delete(`/protocolos/${id}`),
};
