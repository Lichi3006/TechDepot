import api from './api';
import type { Item, ItemCreateDTO } from '../types/Item';

export interface ItemFilterDTO {
    idsMarcas?: number[];
    idsEstados?: number[];
    idsContenedores?: number[];
    idsPuertos?: number[];
    idsCategoriasFuncion?: number[];
    idsCategoriasHardware?: number[];
    query?: string;
}

/**
 * Servicio para gestionar las peticiones de Items al Backend.
 */
export const itemService = {
    getAll: async (): Promise<Item[]> => {
        const { data } = await api.get<Item[]>('/items');
        return data;
    },

    search: async (filters: ItemFilterDTO): Promise<Item[]> => {
        const { data } = await api.post<Item[]>('/items/search', filters);
        return data;
    },

    create: async (item: ItemCreateDTO): Promise<Item> => {
        const { data } = await api.post<Item>('/items', item);
        return data;
    },

    update: async (id: number, item: ItemCreateDTO): Promise<Item> => {
        const { data } = await api.put<Item>(`/items/${id}`, item);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/items/${id}`);
    }
};
