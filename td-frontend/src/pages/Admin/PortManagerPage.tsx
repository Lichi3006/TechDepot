import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefPuerto, RefCategoriaFuncion, LinkPuertoCapacidad } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import './AdminGlobal.css';

export default function PortManagerPage() {
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [funciones, setFunciones] = useState<RefCategoriaFuncion[]>([]);
    const [capacidades, setCapacidades] = useState<LinkPuertoCapacidad[]>([]);
    
    const [newPortName, setNewPortName] = useState('');
    const [selectedPortId, setSelectedPortPortId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteInfo, setDeleteInfo] = useState<{id: number, nombre: string} | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [portData, funcData, capData] = await Promise.all([
                refService.getPuertos(),
                refService.getCategoriasFuncion(),
                refService.getPuertosCapacidades()
            ]);
            setPuertos(portData);
            setFunciones(funcData);
            setCapacidades(capData);
        } catch (error) {
            console.error("Error cargando datos de puertos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSavePort = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPortName.trim()) return;

        try {
            await refService.savePuerto({ nombre: newPortName });
            setNewPortName('');
            await loadData();
        } catch (error: any) {
            console.error("Error al guardar puerto", error);
        }
    };

    const confirmDelete = async () => {
        if (!deleteInfo) return;
        try {
            await refService.deletePuerto(deleteInfo.id);
            if (selectedPortId === deleteInfo.id) {
                setSelectedPortPortId(null);
            }
            setDeleteInfo(null);
            await loadData();
        } catch (error: any) {
            console.error("Error al eliminar puerto:", error);
            setDeleteInfo(null);
        }
    };

    const [newFuncName, setNewFuncName] = useState('');

    const handleSaveFunction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFuncName.trim()) return;

        try {
            await refService.saveCategoriaFuncion({ nombre: newFuncName.trim() });
            setNewFuncName('');
            await loadData();
        } catch (error: any) {
            console.error("Error al guardar la función", error);
        }
    };

    const toggleCapacity = async (idFuncion: number) => {
        if (!selectedPortId) return;

        const hasCapacity = capacidades.some(c => c.puerto.id === selectedPortId && c.categoriaFuncion.id === idFuncion);

        try {
            if (!hasCapacity) {
                await refService.savePuertoCapacidad(selectedPortId, idFuncion);
                await loadData();
            } else {
                console.error("Para eliminar una capacidad, debés hacerlo desde la base de datos (por seguridad de integridad).");
            }
        } catch (error: any) {
            console.error("Error al actualizar capacidad", error);
        }
    };

    const selectedPort = puertos.find(p => p.id === selectedPortId);

    return (
        <div className="admin-page-container">
            <ConfirmModal 
                isOpen={deleteInfo !== null} 
                title="Eliminar Puerto" 
                message={`¿Estás seguro de que deseas eliminar el puerto "${deleteInfo?.nombre}"? Esto también eliminará todos sus protocolos y capacidades asociadas.`} 
                onConfirm={confirmDelete} 
                onCancel={() => setDeleteInfo(null)} 
            />
            <header className="glass-panel admin-header">
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Infraestructura Física</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá puertos y definí sus capacidades lógicas.</p>
            </header>

            <div className="admin-grid">
                {/* LADO IZQUIERDO: CREACIÓN Y LISTA */}
                <div>
                    <div className="glass-panel admin-card">
                        <h3 style={{ color: 'var(--text-primary)' }}>Nuevo Puerto</h3>
                        <form onSubmit={handleSavePort} className="admin-form-row">
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Nombre del Puerto:</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: USB-C, HDMI..." 
                                    value={newPortName}
                                    onChange={(e) => setNewPortName(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="success" style={{ minWidth: '120px' }}>Agregar Puerto</Button>
                        </form>

                        <h3 style={{ color: 'var(--text-primary)', marginTop: '24px' }}>Puertos Registrados</h3>
                        {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                            <table className="admin-table" style={tableStyle}>
                                <thead>
                                    <tr style={headerRowStyle}>
                                        <th style={thStyle}>Nombre del Puerto</th>
                                        <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {puertos.map(p => (
                                        <tr 
                                            key={p.id} 
                                            onClick={() => setSelectedPortPortId(p.id!)}
                                            style={{ 
                                                ...rowStyle, 
                                                cursor: 'pointer',
                                                backgroundColor: selectedPortId === p.id ? 'rgba(117, 229, 97, 0.15)' : 'transparent' 
                                            }}
                                        >
                                            <td style={{ ...tdStyle, fontWeight: selectedPortId === p.id ? 'bold' : 'normal', color: 'var(--text-primary)' }}>{p.nombre}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center', width: '80px' }}>
                                                <button 
                                                    type="button" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteInfo({ id: p.id!, nombre: p.nombre });
                                                    }}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'var(--danger-color)',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem',
                                                        padding: '4px 8px'
                                                    }}
                                                    title="Eliminar Puerto"
                                                >
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {puertos.length === 0 && (
                                        <tr>
                                            <td colSpan={2} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                No hay puertos registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="glass-panel admin-card">
                        <h3 style={{ color: 'var(--text-primary)' }}>Nueva Función Física</h3>
                        <form onSubmit={handleSaveFunction} className="admin-form-row" style={{ marginBottom: '24px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Nombre de la Función:</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: Redes, Video..." 
                                    value={newFuncName}
                                    onChange={(e) => setNewFuncName(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="success" style={{ minWidth: '120px' }}>Agregar Función</Button>
                        </form>

                        <h3 style={{ color: 'var(--text-primary)' }}>Funciones Existentes</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {funciones.map(f => (
                                <span 
                                    key={f.id} 
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: 'var(--surface-color)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    {f.nombre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: CAPACIDADES DEL PUERTO SELECCIONADO */}
                <div>
                    <div className="glass-panel" style={{ ...cardStyle, minHeight: '300px', position: 'sticky', top: '24px' }}>
                        <h3 style={{ color: 'var(--text-primary)' }}>Capacidades de: <span style={{color: 'var(--brand-color)'}}>{selectedPort ? selectedPort.nombre : 'Seleccione un puerto'}</span></h3>
                        {!selectedPort ? (
                            <p style={{ color: 'var(--text-secondary)', marginTop: '20px' }}>Seleccioná un puerto de la lista para gestionar qué puede hacer (Energía, Datos, etc.).</p>
                        ) : (
                            <div style={{ marginTop: '20px' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                    Marcá las funciones que este puerto es capaz de realizar físicamente:
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {funciones.map(f => {
                                        const isActive = capacidades.some(c => c.puerto.id === selectedPortId && c.categoriaFuncion.id === f.id);
                                        return (
                                            <label key={f.id} style={checkboxLabelStyle(isActive)}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isActive} 
                                                    onChange={() => toggleCapacity(f.id!)}
                                                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-color)' }}
                                                />
                                                <span style={{ fontSize: '1rem', marginLeft: '10px' }}>{f.nombre}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <div style={{ marginTop: '30px', padding: '15px', backgroundColor: 'rgba(255, 200, 0, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 200, 0, 0.3)' }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#ffca28' }}>
                                        <strong>Nota:</strong> Definir una capacidad permite que luego puedas asignar protocolos (como USB 3.0) a este puerto bajo esa función.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const layoutGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px'
};

const cardStyle: React.CSSProperties = {
    padding: '24px',
    marginBottom: '24px',
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

const checkboxLabelStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: isActive ? 'rgba(117, 229, 97, 0.1)' : 'var(--surface-hover)',
    cursor: 'pointer',
    border: `1px solid ${isActive ? 'rgba(117, 229, 97, 0.3)' : 'var(--border-color)'}`,
    color: 'var(--text-primary)',
    transition: 'all 0.2s'
});
