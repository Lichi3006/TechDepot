import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefColor } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import './AdminGlobal.css';

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
        <div className="admin-page-container">
            <ConfirmModal 
                isOpen={deleteId !== null} 
                title="Eliminar Color" 
                message="¿Está seguro de que desea eliminar este color de los preestablecidos?" 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteId(null)} 
            />
            <header className="glass-panel admin-header">
                <h1 className="admin-title">Gestión de Colores</h1>
                <p className="admin-description">Administrá los colores preestablecidos que aparecen en la paleta rápida.</p>
            </header>

            <div className="glass-panel admin-card">
                <h3 className="admin-card-title">Nuevo Color</h3>
                <form onSubmit={handleSave} className="admin-form-row">
                    <div className="admin-form-fields">
                        <div>
                            <label className="admin-form-label">Seleccionar Color:</label>
                            <input 
                                type="color" 
                                value={hex}
                                onChange={(e) => setHex(e.target.value.toUpperCase())}
                                style={colorInputStyle}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Código Hexadecimal:</label>
                            <input 
                                type="text" 
                                value={hex}
                                onChange={(e) => setHex(e.target.value.toUpperCase())}
                               
                                placeholder="#000000"
                                pattern="^#[0-9A-F]{6}$"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" variant="success" style={{ minWidth: '150px' }}>Agregar Color</Button>
                </form>
            </div>

            <div className="glass-panel admin-card">
                <h3 className="admin-card-title">Colores Registrados</h3>
                {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colores.map(c => (
                                <tr key={c.id}>

                                    <td>
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
                                    <td>
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
                                    <td colSpan={2}>
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

const colorInputStyle: React.CSSProperties = {
    width: '60px',
    height: '42px',
    padding: '2px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    cursor: 'pointer'
};
