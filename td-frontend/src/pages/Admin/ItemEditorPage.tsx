import { useNavigate } from 'react-router-dom';
import type { ItemCreateDTO } from '../../types/Item.ts';
import { itemService } from '../../services/itemService.ts';
import { ItemForm } from '../../components/inventory/ItemForm.tsx';

export default function ItemEditorPage() {
    const navigate = useNavigate();

    const handleSave = async (dto: ItemCreateDTO) => {
        try {
            await itemService.create(dto);
            alert("Item guardado correctamente");
            navigate('/');
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar el item.");
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#1a1a1a' }}>Nuevo Item</h1>
                <p style={{ color: '#666' }}>Completá los datos para registrar un nuevo componente.</p>
            </header>
            
            <ItemForm 
                onSave={handleSave} 
                onCancel={() => navigate('/')} 
            />
        </div>
    );
}
