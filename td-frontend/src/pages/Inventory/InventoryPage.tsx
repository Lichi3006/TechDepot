import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../../types/Item.ts';
import { itemService } from '../../services/itemService.ts';
import type { ItemFilterDTO } from '../../services/itemService.ts';
import { ItemTable } from '../../components/inventory/ItemTable.tsx';
import { FilterSidebar } from '../../components/inventory/FilterSidebar.tsx';

export default function InventoryPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<ItemFilterDTO>({});
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

    const handleEliminar = async (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar este item?")) {
            try {
                await itemService.delete(id);
                await cargarDatos(filters);
            } catch (error) {
                alert("Error al eliminar el item");
            }
        }
    };

    return (
        <div style={pageContainerStyle}>
            <FilterSidebar onFilterChange={handleFilterChange} />
            
            <div style={contentAreaStyle}>
                <header className="glass-panel" style={headerCardStyle}>
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
                                onDeleteItem={handleEliminar} 
                                onEditItem={(id) => navigate(`/admin/items/edit/${id}`)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    height: '100%',
    overflow: 'hidden'
};

const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingRight: '8px'
};

const headerCardStyle: React.CSSProperties = {
    padding: '24px',
    margin: 0
};
