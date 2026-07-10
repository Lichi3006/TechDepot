import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../../types/Item.ts';
import { itemService } from '../../services/itemService.ts';
import type { ItemFilterDTO } from '../../services/itemService.ts';
import { ItemTable } from '../../components/inventory/ItemTable.tsx';
import { FilterSidebar } from '../../components/inventory/FilterSidebar.tsx';
import { ConfirmModal } from '../../components/ui/ConfirmModal.tsx';

import './InventoryPage.css';

export default function InventoryPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<ItemFilterDTO>({});
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const navigate = useNavigate();

    const cargarDatos = useCallback(async (currentFilters: ItemFilterDTO = {}) => {
        try {
            setLoading(true);
            
            // Si hay filtros activos, usamos el endpoint de búsqueda
            const hasFilters = Object.values(currentFilters).some(v => 
                (Array.isArray(v) && v.length > 0) || (typeof v === 'string' && v.length > 0)
            );

            const data = hasFilters 
                ? await itemService.search(currentFilters)
                : await itemService.getAll();
            
            setItems(data);
        } catch (error) {
            console.error("Error al cargar items:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos(filters);
    }, [filters, cargarDatos]);

    const handleFilterChange = (newFilters: ItemFilterDTO) => {
        setFilters(newFilters);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await itemService.delete(deleteId);
            await cargarDatos(filters);
        } catch (error) {
            console.error("Error al eliminar el item");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="inventory-page-container">
            <ConfirmModal 
                isOpen={deleteId !== null} 
                title="Eliminar Item" 
                message="¿Estás seguro de eliminar este item del inventario?" 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteId(null)} 
            />
            <FilterSidebar onFilterChange={handleFilterChange} />
            
            <div className="inventory-content-area">
                <header className="glass-panel" style={{ padding: '24px', margin: 0 }}>
                    <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Inventario de Hardware</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Gestioná tus cables, fuentes y componentes.</p>
                </header>

                <div className="glass-panel" style={{ padding: '24px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--brand-color)' }}>
                            <h2 className="text-neon">Cargando inventario...</h2>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Mostrando <strong style={{color: 'var(--text-primary)'}}>{items.length}</strong> items
                            </div>
                            <ItemTable 
                                items={items} 
                                onDeleteItem={(id) => setDeleteId(id)} 
                                onEditItem={(id) => navigate(`/admin/items/edit/${id}`)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
