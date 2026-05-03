import api from './api';
import type { 
    RefMarca, 
    RefEstado, 
    RefColor, 
    Contenedor, 
    RefCategoriaItem, 
    RefPuerto, 
    RefProtocolo 
} from '../types/Item';

export const refService = {
    // Marcas
    getMarcas: () => api.get<RefMarca[]>('/marcas').then(r => r.data),
    saveMarca: (data: RefMarca) => api.post<RefMarca>('/marcas', data).then(r => r.data),

    // Estados
    getEstados: () => api.get<RefEstado[]>('/estados').then(r => r.data),
    saveEstado: (data: RefEstado) => api.post<RefEstado>('/estados', data).then(r => r.data),

    // Colores
    getColores: () => api.get<RefColor[]>('/colores').then(r => r.data),
    saveColor: (data: RefColor) => api.post<RefColor>('/colores', data).then(r => r.data),

    // Contenedores
    getContenedores: () => api.get<Contenedor[]>('/contenedores').then(r => r.data),
    saveContenedor: (data: Contenedor) => api.post<Contenedor>('/contenedores', data).then(r => r.data),

    // Categorías de Item
    getCategoriasItem: () => api.get<RefCategoriaItem[]>('/categorias-item').then(r => r.data),
    saveCategoriaItem: (data: RefCategoriaItem) => api.post<RefCategoriaItem>('/categorias-item', data).then(r => r.data),

    // Puertos
    getPuertos: () => api.get<RefPuerto[]>('/puertos').then(r => r.data),
    savePuerto: (data: RefPuerto) => api.post<RefPuerto>('/puertos', data).then(r => r.data),

    // Protocolos
    getProtocolos: () => api.get<RefProtocolo[]>('/protocolos').then(r => r.data),
    saveProtocolo: (data: RefProtocolo) => api.post<RefProtocolo>('/protocolos', data).then(r => r.data),
};
