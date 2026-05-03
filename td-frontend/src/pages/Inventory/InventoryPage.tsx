import { useState, useEffect } from 'react';
import type { Item } from '../../types/Item.ts';
import { itemService } from '../../services/itemService.ts';
import { ItemTable } from '../../components/inventory/ItemTable.tsx';

export default function InventoryPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const data = await itemService.getAll();
            setItems(data);
        } catch (error) {
            console.error("Error al cargar items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleEliminar = async (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar este item?")) {
            try {
                await itemService.delete(id);
                await cargarDatos();
            } catch (error) {
                alert("Error al eliminar el item");
            }
        }
    };

    return (
        <div>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#1a1a1a' }}>Inventario de Hardware</h1>
                <p style={{ color: '#666' }}>Gestioná tus cables, fuentes y componentes.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Cargando inventario...</h2>
                </div>
            ) : (
                <ItemTable items={items} onDeleteItem={handleEliminar} />
            )}
        </div>
    );
}
