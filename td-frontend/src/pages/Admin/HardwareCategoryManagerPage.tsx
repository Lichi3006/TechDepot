import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefBase } from '../../types/Item';
import { Button } from '../../components/ui/Button';

export default function HardwareCategoryManagerPage() {
    const [categorias, setCategorias] = useState<RefBase[]>([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await refService.getCategoriasHardware();
            setCategorias(data);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await refService.saveCategoriaHardware({ nombre: name.trim() });
            setName('');
            await loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al guardar categoría");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Está seguro de que desea eliminar esta categoría de hardware?")) return;
        try {
            await refService.deleteCategoriaHardware(id);
            await loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al eliminar categoría");
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <header className="glass-panel" style={{ padding: '24px' }}>
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Categorías de Hardware</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá las clasificaciones secundarias para el equipamiento físico general (Motherboard, Procesador, GPU, etc.).</p>
            </header>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Nueva Categoría</h3>
                <form onSubmit={handleSave} style={formStyle}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Nombre de la Categoría:</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Disco Duro (HDD/SSD), Tarjeta Gráfica..." 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <Button type="submit" variant="success" style={{ minWidth: '150px' }}>Agregar Categoría</Button>
                </form>
            </div>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Categorías Registradas</h3>
                {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Nombre de la Categoría</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map(c => (
                                <tr key={c.id} style={rowStyle}>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)', width: '80px' }}>{c.id}</td>
                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{c.nombre}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center', width: '150px' }}>
                                        <Button 
                                            onClick={() => c.id !== undefined && handleDelete(c.id)} 
                                            variant="danger" 
                                            style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {categorias.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No hay categorías registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    padding: '24px',
    marginBottom: '24px'
};

const formStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '15px'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
};

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
};

const headerRowStyle: React.CSSProperties = {
    borderBottom: '2px solid var(--border-color)',
    textAlign: 'left'
};

const thStyle: React.CSSProperties = {
    padding: '12px 10px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase'
};

const rowStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s'
};

const tdStyle: React.CSSProperties = {
    padding: '12px 10px',
    fontSize: '0.9rem'
};
