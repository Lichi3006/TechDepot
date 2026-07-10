import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefBase } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import './AdminGlobal.css';

export default function HardwareCategoryManagerPage() {
    const [categorias, setCategorias] = useState<RefBase[]>([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

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
            console.error(error.response?.data?.message || "Error al guardar categoría");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await refService.deleteCategoriaHardware(deleteId);
            setDeleteId(null);
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al eliminar categoría");
            setDeleteId(null);
        }
    };

    return (
        <div className="admin-page-container">
            <ConfirmModal 
                isOpen={deleteId !== null} 
                title="Eliminar Categoría" 
                message="¿Está seguro de que desea eliminar esta categoría de hardware?" 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteId(null)} 
            />
            <header className="glass-panel admin-header">
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Categorías de Hardware</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá las clasificaciones secundarias para el equipamiento físico general (Motherboard, Procesador, GPU, etc.).</p>
            </header>

            <div className="glass-panel admin-card">
                <h3 style={{ color: 'var(--text-primary)' }}>Nueva Categoría</h3>
                <form onSubmit={handleSave} className="admin-form-row">
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

            <div className="glass-panel admin-card">
                <h3 style={{ color: 'var(--text-primary)' }}>Categorías Registradas</h3>
                {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                    <table className="admin-table" style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>

                                <th style={thStyle}>Nombre de la Categoría</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map(c => (
                                <tr key={c.id} style={rowStyle}>

                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{c.nombre}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center', width: '150px' }}>
                                        <button 
                                            type="button"
                                            onClick={() => c.id !== undefined && setDeleteId(c.id)} 
                                            style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 8px' }}
                                            title="Eliminar"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categorias.length === 0 && (
                                <tr>
                                    <td colSpan={2} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
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
