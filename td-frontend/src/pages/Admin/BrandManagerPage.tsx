import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefMarca } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import './AdminGlobal.css';

export default function BrandManagerPage() {
    const [marcas, setMarcas] = useState<RefMarca[]>([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await refService.getMarcas();
            setMarcas(data);
        } catch (error) {
            console.error("Error cargando marcas:", error);
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
            await refService.saveMarca({ nombre: name.trim() });
            setName('');
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al guardar marca");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await refService.deleteMarca(deleteId);
            setDeleteId(null);
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al eliminar marca");
            setDeleteId(null);
        }
    };

    return (
        <div className="admin-page-container">
            <ConfirmModal 
                isOpen={deleteId !== null} 
                title="Eliminar Marca" 
                message="¿Está seguro de que desea eliminar esta marca?" 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteId(null)} 
            />
            <header className="glass-panel admin-header">
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Marcas</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá las marcas de los fabricantes del equipamiento físico.</p>
            </header>

            <div className="glass-panel admin-card">
                <h3 style={{ color: 'var(--text-primary)' }}>Nueva Marca</h3>
                <form onSubmit={handleSave} className="admin-form-row">
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Nombre de la Marca:</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Cisco, Ubiquiti, Dell..." 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <Button type="submit" variant="success" style={{ minWidth: '150px' }}>Agregar Marca</Button>
                </form>
            </div>

            <div className="glass-panel admin-card">
                <h3 style={{ color: 'var(--text-primary)' }}>Marcas Registradas</h3>
                {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                    <table className="admin-table" style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>

                                <th style={thStyle}>Nombre de la Marca</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marcas.map(m => (
                                <tr key={m.id} style={rowStyle}>

                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{m.nombre}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center', width: '150px' }}>
                                        <button 
                                            type="button"
                                            onClick={() => m.id !== undefined && setDeleteId(m.id)} 
                                            style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 8px' }}
                                            title="Eliminar"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {marcas.length === 0 && (
                                <tr>
                                    <td colSpan={2} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No hay marcas registradas.
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
