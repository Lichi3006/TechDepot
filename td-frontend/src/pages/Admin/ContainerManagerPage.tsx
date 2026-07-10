import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { Contenedor, RefTipoContenedor } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

import './ContainerManagerPage.css';

export default function ContainerManagerPage() {
    const [contenedores, setContenedores] = useState<Contenedor[]>([]);
    const [tipos, setTipos] = useState<RefTipoContenedor[]>([]);
    
    const [selectedTipoId, setSelectedTipoId] = useState<number>(0);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [newTypeName, setNewTypeName] = useState('');
    const [newTypePrefix, setNewTypePrefix] = useState('');
    const [deleteInfo, setDeleteInfo] = useState<{type: 'contenedor' | 'tipo', id: number, nombre: string} | null>(null);

    const handleCreateType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTypeName.trim() || !newTypePrefix.trim()) return;

        try {
            await refService.saveTipoContenedor({ 
                nombre: newTypeName.trim(), 
                prefijo: newTypePrefix.trim().toUpperCase() 
            });
            setNewTypeName('');
            setNewTypePrefix('');
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al crear tipo de contenedor");
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [contData, tipoData] = await Promise.all([
                refService.getContenedores(),
                refService.getTiposContenedor()
            ]);
            setContenedores(contData);
            setTipos(tipoData);
        } catch (error) {
            console.error("Error cargando contenedores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTipoId) return;

        try {
            await refService.saveContenedor({ tipoContenedor: { id: selectedTipoId } });
            setSelectedTipoId(0);
            await loadData();
        } catch (error) {
            console.error("Error al crear contenedor");
        }
    };

    const handleUpdateType = async (id: number, newTipoId: number) => {
        try {
            await refService.updateContenedor(id, { tipoContenedor: { id: newTipoId } });
            setEditingId(null);
            await loadData();
        } catch (error) {
            console.error("Error al actualizar tipo");
        }
    };

    const confirmDelete = async () => {
        if (!deleteInfo) return;
        try {
            if (deleteInfo.type === 'contenedor') {
                await refService.deleteContenedor(deleteInfo.id);
            } else if (deleteInfo.type === 'tipo') {
                await refService.deleteTipoContenedor(deleteInfo.id);
            }
            setDeleteInfo(null);
            await loadData();
        } catch (error) {
            console.error("Error al eliminar");
            setDeleteInfo(null);
        }
    };

    return (
        <div className="container-manager-page">
            <ConfirmModal 
                isOpen={deleteInfo !== null} 
                title={deleteInfo?.type === 'contenedor' ? "Eliminar Contenedor" : "Eliminar Tipo de Contenedor"} 
                message={deleteInfo?.type === 'contenedor' 
                    ? `¿ESTÁS SEGURO? Eliminar el contenedor "${deleteInfo?.nombre}" borrará TODOS los ítems que tiene adentro permanentemente.`
                    : `¿Estás seguro de que deseas eliminar el tipo "${deleteInfo?.nombre}"?`
                } 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteInfo(null)} 
            />
            <header className="glass-panel admin-header">
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Contenedores</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá las unidades de almacenamiento y sus tipos.</p>
            </header>

            <div className="admin-grid">
                {/* LADO IZQUIERDO: CONTENEDORES */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel admin-card">
                        <h3 style={{ color: 'var(--text-primary)' }}>Nuevo Contenedor</h3>
                        <form onSubmit={handleCreate} className="admin-form-row">
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Tipo de Contenedor:</label>
                                <select 
                                    value={selectedTipoId} 
                                    onChange={(e) => setSelectedTipoId(Number(e.target.value))}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="0">Seleccione tipo...</option>
                                    {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre} ({t.prefijo})</option>)}
                                </select>
                            </div>
                            <Button type="submit" variant="success" disabled={!selectedTipoId} style={{ minWidth: '150px' }}>Crear Nuevo</Button>
                        </form>
                    </div>

                    <div className="glass-panel admin-card">
                        <h3 style={{ color: 'var(--text-primary)' }}>Inventario de Contenedores</h3>
                        {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                            <table className="admin-table" style={tableStyle}>
                                <thead>
                                    <tr style={headerRowStyle}>
                                        <th style={thStyle}>Nombre Técnico</th>
                                        <th style={thStyle}>Tipo</th>
                                        <th style={thStyle}>UUID (QR)</th>
                                        <th style={thStyle}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contenedores.map(c => (
                                        <tr key={c.id} style={rowStyle}>
                                            <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--brand-color)' }}>{c.nombre}</td>
                                            <td style={tdStyle}>
                                                {editingId === c.id ? (
                                                    <select 
                                                        defaultValue={c.tipoContenedor?.id} 
                                                        onChange={(e) => handleUpdateType(c.id!, Number(e.target.value))}
                                                        style={miniInputStyle}
                                                    >
                                                        {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                                    </select>
                                                ) : (
                                                    <span onClick={() => setEditingId(c.id!)} style={{ cursor: 'pointer', borderBottom: '1px dashed var(--text-secondary)' }}>
                                                        {c.tipoContenedor?.nombre || 'Sin tipo'}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                {c.QrUUID ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                                            {c.QrUUID.substring(0, 8)}...
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(c.QrUUID!);
                                                                // Simple visual feedback
                                                                const btn = document.getElementById(`copy-btn-${c.id}`);
                                                                if(btn) {
                                                                    const originalIcon = btn.innerHTML;
                                                                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                                                                    btn.style.color = 'var(--brand-color)';
                                                                    btn.style.borderColor = 'var(--brand-color)';
                                                                    setTimeout(() => {
                                                                        btn.innerHTML = originalIcon;
                                                                        btn.style.color = 'var(--text-primary)';
                                                                        btn.style.borderColor = 'var(--border-color)';
                                                                    }, 2000);
                                                                }
                                                            }}
                                                            id={`copy-btn-${c.id}`}
                                                            style={{ 
                                                                background: 'var(--surface-color)', border: '1px solid var(--border-color)', 
                                                                borderRadius: '4px', cursor: 'pointer', padding: '4px', 
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                color: 'var(--text-primary)', transition: 'all 0.2s', width: '30px', height: '26px'
                                                            }}
                                                            title="Copiar UUID"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem' }}>Sin QR (Antiguo)</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Button 
                                                        variant="secondary" 
                                                        onClick={() => setEditingId(editingId === c.id ? null : c.id!)}
                                                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                                    >
                                                        {editingId === c.id ? 'Cancelar' : 'Cambiar Tipo'}
                                                    </Button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setDeleteInfo({ type: 'contenedor', id: c.id!, nombre: c.nombre })}
                                                        style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 8px' }}
                                                        title="Eliminar Contenedor"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                
                {/* LADO DERECHO: TIPOS DE CONTENEDOR */}
                <div className="glass-panel admin-card">
                    <h3 style={{ color: 'var(--text-primary)' }}>Tipos de Contenedor</h3>
                    <form onSubmit={handleCreateType} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', marginBottom: '24px' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={labelStyle}>Nombre del Tipo:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: Hardware de Red, Discos Duros..." 
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={{ flex: '0 1 150px' }}>
                            <label style={labelStyle}>Prefijo (max 5):</label>
                            <input 
                                type="text" 
                                placeholder="Ej: NET, SSD" 
                                value={newTypePrefix}
                                onChange={(e) => setNewTypePrefix(e.target.value)}
                                maxLength={5}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <Button type="submit" variant="success" style={{ width: '100%' }}>Crear Tipo</Button>
                        </div>
                    </form>

                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Tipos Existentes</h4>
                    {tipos.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No hay tipos registrados.</p> : (
                        <table className="admin-table" style={tableStyle}>
                            <thead>
                                <tr style={headerRowStyle}>
                                    <th style={thStyle}>Nombre</th>
                                    <th style={thStyle}>Prefijo</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tipos.map(t => (
                                    <tr key={t.id} style={rowStyle}>
                                        <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{t.nombre}</td>
                                        <td style={tdStyle}>
                                            <span style={{ backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                                {t.prefijo}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <button 
                                                type="button"
                                                onClick={() => setDeleteInfo({ type: 'tipo', id: t.id!, nombre: t.nombre })}
                                                style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 8px' }}
                                                title="Eliminar Tipo"
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

const cardStyle: React.CSSProperties = {
    padding: '24px',
    marginBottom: '24px',
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
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
};

const miniInputStyle: React.CSSProperties = {
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid var(--brand-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem'
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

