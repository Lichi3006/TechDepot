import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefProtocolo, RefPuerto, RefCategoriaFuncion } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export default function ProtocolManagerPage() {
    const [protocolos, setProtocolos] = useState<RefProtocolo[]>([]);
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [funciones, setFunciones] = useState<RefCategoriaFuncion[]>([]);
    
    const [name, setName] = useState('');
    const [selectedPuerto, setSelectedPuerto] = useState<number>(0);
    const [selectedFuncion, setSelectedFuncion] = useState<number>(0);
    
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [protData, portData, funcData] = await Promise.all([
                refService.getProtocolos(),
                refService.getPuertos(),
                refService.getCategoriasFuncion()
            ]);
            setProtocolos(protData);
            setPuertos(portData);
            setFunciones(funcData);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!name.trim() || !selectedPuerto || !selectedFuncion) {
            setFormError("Todos los campos son obligatorios");
            return;
        }

        try {
            await refService.saveProtocolo({ 
                nombre: name,
                puerto: { id: selectedPuerto, nombre: '' },
                categoriaFuncion: { id: selectedFuncion, nombre: '' }
            });
            setName('');
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al guardar protocolo");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await refService.deleteProtocolo(deleteId);
            setDeleteId(null);
            await loadData();
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error al eliminar protocolo");
            setDeleteId(null);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <ConfirmModal 
                isOpen={deleteId !== null} 
                title="Eliminar Protocolo" 
                message="¿Está seguro de que desea eliminar este protocolo?" 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteId(null)} 
            />
            <header className="glass-panel" style={{ padding: '24px' }}>
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Protocolos</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Definí las capacidades lógicas de cada puerto físico.</p>
            </header>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Nuevo Protocolo</h3>
                <form onSubmit={handleSave} style={formGridStyle}>
                    <div>
                        <label style={labelStyle}>Nombre:</label>
                        <input 
                            type="text" 
                            placeholder="Ej: USB 3.0, HDMI 2.1..." 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Puerto Físico:</label>
                        <select 
                            value={selectedPuerto} 
                            onChange={(e) => setSelectedPuerto(Number(e.target.value))}
                            style={inputStyle}
                            required
                        >
                            <option value="0">Seleccione puerto...</option>
                            {puertos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Función:</label>
                        <select 
                            value={selectedFuncion} 
                            onChange={(e) => setSelectedFuncion(Number(e.target.value))}
                            style={inputStyle}
                            required
                        >
                            <option value="0">Seleccione función...</option>
                            {funciones.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        {formError && <div style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginBottom: '5px' }}>{formError}</div>}
                        <Button type="submit" variant="success" style={{ minWidth: '150px' }}>Agregar Protocolo</Button>
                    </div>
                </form>
            </div>

            <div className="glass-panel" style={cardStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Protocolos Existentes</h3>
                {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>
                                <th style={thStyle}>Nombre</th>
                                <th style={thStyle}>Puerto</th>
                                <th style={thStyle}>Función</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {protocolos.map(p => (
                                <tr key={p.id} style={rowStyle}>
                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--text-primary)' }}>{p.nombre}</td>
                                    <td style={tdStyle}>{p.puerto.nombre}</td>
                                    <td style={tdStyle}>{p.categoriaFuncion.nombre}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <button 
                                            type="button"
                                            onClick={() => p.id !== undefined && setDeleteId(p.id)} 
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
    );
}

const cardStyle: React.CSSProperties = {
    padding: '24px',
    marginBottom: '24px'
};

const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 150px',
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

