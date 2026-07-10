import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefColor } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { HexColorPicker } from 'react-colorful';
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                <div className="glass-panel admin-card">
                    <h3 className="admin-card-title">Colores Registrados</h3>
                    {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                        <div style={{ columnCount: 2, columnGap: '15px' }}>
                            {colores.map(c => (
                                <div key={c.id} style={{
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    padding: '8px 12px', 
                                    marginBottom: '10px', 
                                    backgroundColor: 'var(--surface-color)', 
                                    border: '1px solid var(--border-color)', 
                                    borderRadius: '6px',
                                    breakInside: 'avoid',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ 
                                            width: '24px', 
                                            height: '24px', 
                                            backgroundColor: c.codigoHex, 
                                            borderRadius: '4px',
                                            border: '1px solid var(--border-color)'
                                        }}></div>
                                        <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 'bold' }}>{c.codigoHex}</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => c.id !== undefined && setDeleteId(c.id)} 
                                        style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.4rem', padding: '0 4px', lineHeight: 1 }}
                                        title="Eliminar"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {colores.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No hay colores preestablecidos.</p>}
                        </div>
                    )}
                </div>

                <div className="glass-panel admin-card">
                    <h3 className="admin-card-title">Nuevo Color</h3>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div>
                                <label className="admin-form-label" style={{ marginBottom: '10px', display: 'block' }}>Seleccionar Color:</label>
                                <HexColorPicker color={hex} onChange={(color) => setHex(color.toUpperCase())} />
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label className="admin-form-label" style={{ marginBottom: '10px', display: 'block' }}>Vista Previa y Hexadecimal:</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ 
                                        width: '60px', 
                                        height: '60px', 
                                        backgroundColor: hex, 
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                                    }}></div>
                                    <input 
                                        type="text" 
                                        value={hex}
                                        onChange={(e) => setHex(e.target.value.toUpperCase())}
                                        placeholder="#000000"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                        required
                                        style={{ 
                                            width: '120px', 
                                            padding: '10px', 
                                            borderRadius: '6px', 
                                            border: '1px solid var(--border-color)', 
                                            backgroundColor: 'var(--input-bg)', 
                                            color: 'var(--text-primary)', 
                                            fontSize: '1rem',
                                            fontFamily: 'monospace',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ alignSelf: 'flex-start' }}>
                            <Button type="submit" variant="success" style={{ minWidth: '150px' }}>Agregar Color</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


