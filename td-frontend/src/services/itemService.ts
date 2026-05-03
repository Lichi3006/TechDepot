import api from './api';
import type { Item, ItemCreateDTO } from '../types/Item';

/**
 * Servicio para gestionar las peticiones de Items al Backend.
 */
export const itemService = {
    getAll: async (): Promise<Item[]> => {
        const { data } = await api.get<Item[]>('/items');
        return data;
    },

    create: async (item: ItemCreateDTO): Promise<Item> => {
        const { data } = await api.post<Item>('/items', item);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/items/${id}`);
    }
};
