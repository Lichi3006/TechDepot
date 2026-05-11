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
                <header style={{ marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#1a1a1a' }}>Inventario de Hardware</h1>
                    <p style={{ color: '#666' }}>Gestioná tus cables, fuentes y componentes.</p>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <h2>Cargando inventario...</h2>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '10px', color: '#666', fontSize: '0.9rem' }}>
                            Mostrando {items.length} items
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
    );
}

const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    margin: '-30px', // Compensar el padding del MainLayout para pegar el sidebar
    height: 'calc(100vh - 0px)',
    overflow: 'hidden'
};

const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
    backgroundColor: '#f0f2f5'
};
