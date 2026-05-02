import { useState, useEffect } from 'react';
import { Item, ItemCreateDTO } from './types/Item';
import { itemService } from './services/itemService';
import { Button } from './components/ui/Button';
import { ItemTable } from './components/inventory/ItemTable';

export default function App() {
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

    const handleInsertarPrueba = async () => {
        const itemPrueba: ItemCreateDTO = {
            idEstado: 1,
            idMarca: 1,
            idContenedor: 1,
            idsColores: [1],
            idsCategoriasItem: [1],
            conexiones: [
                { idPuerto: 1, genero: true, idsProtocolos: [1] }
            ],
            detalleCable: {
                largo: 120,
                idBlindajeExterno: 1,
                idBlindajeInterno: 1,
                amperajeMax: 2
            }
        };

        try {
            await itemService.create(itemPrueba);
            alert("¡Item de prueba creado!");
            await cargarDatos();
        } catch (error) {
            console.error("Error al crear:", error);
            alert("Error al crear el item. Revisa la consola.");
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, color: '#1a1a1a' }}>TechDepot Inventory</h1>
                <Button variant="success" onClick={handleInsertarPrueba}>
                    + Nuevo Item (Prueba)
                </Button>
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
