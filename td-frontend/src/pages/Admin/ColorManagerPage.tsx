import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefColor } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export default function ColorManagerPage() {
    const [colores, setColores] = useState<RefColor[]>([]);
    const [hex, setHex] = useState('#000000');
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await refService.getColores();
            setColores(data);
        } catch (error) {
            console.error("Error cargando colores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hex.trim()) return;

        try {
            await refService.saveColor({ codigoHex: hex.trim() });
            setHex('#000000');
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al guardar color");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await refService.deleteColor(deleteId);
            setDeleteId(null);
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al eliminar color");
            setDeleteId(null);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <ConfirmModal 
                isOpen={deleteId !== null} 
                title="Eliminar Color" 
                message="¿Está seguro de que desea eliminar este color de los preestablecidos?" 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteId(null)} 
            />
            <header className="glass-panel" style={{ padding: '24px' }}>
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Colores</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá los colores preestablecidos que aparecen en la paleta rápida.</p>
            </header>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Nuevo Color</h3>
                <form onSubmit={handleSave} style={formStyle}>
                    <div style={{ flex: 1, display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                        <div>
                            <label style={labelStyle}>Seleccionar Color:</label>
                            <input 
                                type="color" 
                                value={hex}
                                onChange={(e) => setHex(e.target.value.toUpperCase())}
                                style={colorInputStyle}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Código Hexadecimal:</label>
                            <input 
                                type="text" 
                                value={hex}
                                onChange={(e) => setHex(e.target.value.toUpperCase())}
                                style={inputStyle}
                                placeholder="#000000"
                                pattern="^#[0-9A-F]{6}$"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" variant="success" style={{ minWidth: '150px' }}>Agregar Color</Button>
                </form>
            </div>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Colores Registrados</h3>
                {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>

                                <th style={thStyle}>Color</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colores.map(c => (
                                <tr key={c.id} style={rowStyle}>

                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ 
                                                width: '24px', 
                                                height: '24px', 
                                                backgroundColor: c.codigoHex, 
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-color)'
                                            }}></div>
                                            {c.codigoHex}
                                        </div>
                                    </td>
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
                            {colores.length === 0 && (
                                <tr>
                                    <td colSpan={2} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No hay colores preestablecidos.
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

const colorInputStyle: React.CSSProperties = {
    width: '60px',
    height: '42px',
    padding: '2px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    cursor: 'pointer'
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
