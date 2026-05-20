import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { Contenedor, RefTipoContenedor } from '../../types/Item';
import { Button } from '../../components/ui/Button';

export default function ContainerManagerPage() {
    const [contenedores, setContenedores] = useState<Contenedor[]>([]);
    const [tipos, setTipos] = useState<RefTipoContenedor[]>([]);
    
    const [selectedTipoId, setSelectedTipoId] = useState<number>(0);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [newTypeName, setNewTypeName] = useState('');
    const [newTypePrefix, setNewTypePrefix] = useState('');

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
            alert("Tipo de contenedor creado correctamente.");
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al crear tipo de contenedor");
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
            alert("Contenedor creado y nombre generado.");
        } catch (error) {
            alert("Error al crear contenedor");
        }
    };

    const handleUpdateType = async (id: number, newTipoId: number) => {
        try {
            await refService.updateContenedor(id, { tipoContenedor: { id: newTipoId } });
            setEditingId(null);
            await loadData();
            alert("Tipo actualizado (el nombre técnico se ha regenerado)");
        } catch (error) {
            alert("Error al actualizar tipo");
        }
    };

    const handleDelete = async (id: number, nombre: string) => {
        const confirmMsg = `¿ESTÁS SEGURO? Eliminar el contenedor "${nombre}" borrará TODOS los ítems que tiene adentro permanentemente.`;
        if (window.confirm(confirmMsg)) {
            try {
                await refService.deleteContenedor(id);
                await loadData();
                alert("Contenedor y su contenido eliminados.");
            } catch (error) {
                alert("Error al eliminar contenedor");
            }
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <header className="glass-panel" style={{ padding: '24px' }}>
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Contenedores</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá las unidades de almacenamiento y su contenido.</p>
            </header>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Nuevo Contenedor</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
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

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Inventario de Contenedores</h3>
                {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                    <table style={tableStyle}>
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
                                    <td style={{ ...tdStyle, fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                        {c.qrUUID}
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
                                                onClick={() => handleDelete(c.id!, c.nombre)}
                                                className="btn-danger"
                                                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Tipos de Contenedor</h3>
                <form onSubmit={handleCreateType} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '24px' }}>
                    <div style={{ flex: 2 }}>
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
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Prefijo (max 5 letras):</label>
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
                    <Button type="submit" variant="success" style={{ minWidth: '150px' }}>Crear Tipo</Button>
                </form>

                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Tipos Existentes</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                    {tipos.map(t => (
                        <div 
                            key={t.id} 
                            style={{ 
                                padding: '12px', 
                                backgroundColor: 'var(--surface-hover)', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{t.nombre}</span>
                            <span className="badge" style={{ backgroundColor: 'var(--brand-color)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {t.prefijo}
                            </span>
                        </div>
                    ))}
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

