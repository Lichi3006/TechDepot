import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefPuerto, RefCategoriaFuncion, LinkPuertoCapacidad } from '../../types/Item';
import { Button } from '../../components/ui/Button';

export default function PortManagerPage() {
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [funciones, setFunciones] = useState<RefCategoriaFuncion[]>([]);
    const [capacidades, setCapacidades] = useState<LinkPuertoCapacidad[]>([]);
    
    const [newPortName, setNewPortName] = useState('');
    const [selectedPortId, setSelectedPortPortId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

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
            alert("Puerto guardado correctamente");
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al guardar puerto");
        }
    };

    const handleDeletePort = async (id: number, nombre: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar el puerto "${nombre}"? Esto también eliminará todos sus protocolos y capacidades asociadas.`)) {
            return;
        }
        try {
            await refService.deletePuerto(id);
            if (selectedPortId === id) {
                setSelectedPortPortId(null);
            }
            await loadData();
            alert("Puerto eliminado correctamente");
        } catch (error: any) {
            console.error("Error al eliminar puerto:", error);
            alert(error.response?.data?.message || "Error al eliminar el puerto");
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
            alert("Categoría de función guardada correctamente");
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al guardar la función");
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
                alert("Para eliminar una capacidad, debés hacerlo desde la base de datos (por seguridad de integridad).");
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al actualizar capacidad");
        }
    };

    const selectedPort = puertos.find(p => p.id === selectedPortId);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <header className="glass-panel" style={{ padding: '24px' }}>
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Infraestructura Física</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá puertos y definí sus capacidades lógicas.</p>
            </header>

            <div style={layoutGridStyle}>
                {/* LADO IZQUIERDO: CREACIÓN Y LISTA */}
                <div>
                    <div className="glass-panel" style={cardStyle}>
                        <h3 style={{ color: 'var(--text-primary)' }}>Nuevo Puerto</h3>
                        <form onSubmit={handleSavePort} style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Ej: USB-C, HDMI..." 
                                value={newPortName}
                                onChange={(e) => setNewPortName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                            <Button type="submit" variant="success" style={{ minWidth: '120px' }}>Crear</Button>
                        </form>
                    </div>

                    <div className="glass-panel" style={cardStyle}>
                        <h3 style={{ color: 'var(--text-primary)' }}>Puertos</h3>
                        {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {puertos.map(p => (
                                    <div 
                                        key={p.id} 
                                        onClick={() => setSelectedPortPortId(p.id!)}
                                        style={{
                                            ...itemStyle, 
                                            backgroundColor: selectedPortId === p.id ? 'rgba(117, 229, 97, 0.15)' : 'var(--surface-hover)',
                                            borderColor: selectedPortId === p.id ? 'var(--brand-color)' : 'var(--border-color)',
                                            color: 'var(--text-primary)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: selectedPortId === p.id ? 'bold' : 'normal' }}>{p.nombre}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>ID: {p.id}</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePort(p.id!, p.nombre);
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={cardStyle}>
                        <h3 style={{ color: 'var(--text-primary)' }}>Nueva Función Física</h3>
                        <form onSubmit={handleSaveFunction} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <input 
                                type="text" 
                                placeholder="Ej: Redes, Video..." 
                                value={newFuncName}
                                onChange={(e) => setNewFuncName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                            <Button type="submit" variant="success" style={{ minWidth: '120px' }}>Crear</Button>
                        </form>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Funciones Existentes</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {funciones.map(f => (
                                <span 
                                    key={f.id} 
                                    style={{
                                        padding: '4px 10px',
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
                    <div className="glass-panel" style={{ ...cardStyle, minHeight: '300px' }}>
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

const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
};

const itemStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const checkboxLabelStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: isActive ? 'rgba(117, 229, 97, 0.1)' : 'var(--surface-hover)',
    cursor: 'pointer',
    border: `1px solid ${isActive ? 'rgba(117, 229, 97, 0.3)' : 'var(--border-color)'}`,
    color: 'var(--text-primary)'
});

