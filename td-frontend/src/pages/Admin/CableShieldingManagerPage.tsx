import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefBase } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import './AdminGlobal.css';

export default function CableShieldingManagerPage() {
    const [externos, setExternos] = useState<RefBase[]>([]);
    const [internos, setInternos] = useState<RefBase[]>([]);
    
    const [extName, setExtName] = useState('');
    const [intName, setIntName] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [deleteInfo, setDeleteInfo] = useState<{type: 'externo' | 'interno', id: number} | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [extData, intData] = await Promise.all([
                refService.getBlindajesExternos(),
                refService.getBlindajesInternos()
            ]);
            setExternos(extData);
            setInternos(intData);
        } catch (error) {
            console.error("Error cargando blindajes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSaveExterno = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!extName.trim()) return;
        try {
            await refService.saveBlindajeExterno({ nombre: extName.trim() });
            setExtName('');
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al guardar blindaje externo");
        }
    };

    const handleSaveInterno = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!intName.trim()) return;
        try {
            await refService.saveBlindajeInterno({ nombre: intName.trim() });
            setIntName('');
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al guardar blindaje interno");
        }
    };

    const confirmDelete = async () => {
        if (!deleteInfo) return;
        try {
            if (deleteInfo.type === 'externo') {
                await refService.deleteBlindajeExterno(deleteInfo.id);
            } else {
                await refService.deleteBlindajeInterno(deleteInfo.id);
            }
            setDeleteInfo(null);
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al eliminar blindaje");
            setDeleteInfo(null);
        }
    };

    return (
        <div className="admin-page-container">
            <ConfirmModal 
                isOpen={deleteInfo !== null} 
                title={`Eliminar Blindaje ${deleteInfo?.type === 'externo' ? 'Externo' : 'Interno'}`} 
                message={`¿Está seguro de que desea eliminar este blindaje ${deleteInfo?.type}?`} 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteInfo(null)} 
            />
            <header className="glass-panel admin-header">
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Blindajes</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá las propiedades físicas de aislamiento para los cables del inventario.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                {/* BLINDAJE EXTERNO */}
                <div className="glass-panel admin-card">
                    <h3 style={{ color: 'var(--text-primary)' }}>Blindajes Externos</h3>
                    
                    <form onSubmit={handleSaveExterno} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div>
                            <label style={labelStyle}>Nombre del Blindaje Externo:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: Trenzado Nylon..." 
                                value={extName}
                                onChange={(e) => setExtName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={{ alignSelf: 'flex-end' }}>
                            <Button type="submit" variant="success" style={{ minWidth: '120px' }}>Agregar</Button>
                        </div>
                    </form>

                    {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                        <table className="admin-table" style={tableStyle}>
                            <thead>
                                <tr style={headerRowStyle}>
                                    <th style={thStyle}>Nombre</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {externos.map(b => (
                                    <tr key={b.id} style={rowStyle}>
                                        <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{b.nombre}</td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <button 
                                                type="button"
                                                onClick={() => b.id !== undefined && setDeleteInfo({ type: 'externo', id: b.id })} 
                                                style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 8px' }}
                                                title="Eliminar"
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* BLINDAJE INTERNO */}
                <div className="glass-panel admin-card">
                    <h3 style={{ color: 'var(--text-primary)' }}>Blindajes Internos</h3>
                    
                    <form onSubmit={handleSaveInterno} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div>
                            <label style={labelStyle}>Nombre del Blindaje Interno:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: Lámina Aluminio..." 
                                value={intName}
                                onChange={(e) => setIntName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={{ alignSelf: 'flex-end' }}>
                            <Button type="submit" variant="success" style={{ minWidth: '120px' }}>Agregar</Button>
                        </div>
                    </form>

                    {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                        <table className="admin-table" style={tableStyle}>
                            <thead>
                                <tr style={headerRowStyle}>
                                    <th style={thStyle}>Nombre</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internos.map(b => (
                                    <tr key={b.id} style={rowStyle}>
                                        <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{b.nombre}</td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <button 
                                                type="button"
                                                onClick={() => b.id !== undefined && setDeleteInfo({ type: 'interno', id: b.id })} 
                                                style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 8px' }}
                                                title="Eliminar"
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

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
