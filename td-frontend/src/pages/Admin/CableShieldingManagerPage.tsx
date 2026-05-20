import { useState, useEffect } from 'react';
import { refService } from '../../services/refService';
import type { RefBase } from '../../types/Item';
import { Button } from '../../components/ui/Button';

export default function CableShieldingManagerPage() {
    const [externos, setExternos] = useState<RefBase[]>([]);
    const [internos, setInternos] = useState<RefBase[]>([]);
    
    const [extName, setExtName] = useState('');
    const [intName, setIntName] = useState('');
    
    const [loading, setLoading] = useState(true);

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
            alert(error.response?.data?.message || "Error al guardar blindaje externo");
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
            alert(error.response?.data?.message || "Error al guardar blindaje interno");
        }
    };

    const handleDeleteExterno = async (id: number) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este blindaje externo?")) return;
        try {
            await refService.deleteBlindajeExterno(id);
            await loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al eliminar blindaje externo");
        }
    };

    const handleDeleteInterno = async (id: number) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este blindaje interno?")) return;
        try {
            await refService.deleteBlindajeInterno(id);
            await loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error al eliminar blindaje interno");
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <header className="glass-panel" style={{ padding: '24px' }}>
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>Gestión de Blindajes de Cables</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Administrá las propiedades físicas de aislamiento para los cables del inventario.</p>
            </header>

            <div style={gridStyle}>
                {/* BLINDAJE EXTERNO */}
                <div className="glass-panel" style={cardStyle}>
                    <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>Blindajes Externos</h3>
                    
                    <form onSubmit={handleSaveExterno} style={formStyle}>
                        <div style={{ flex: 1 }}>
                            <input 
                                type="text" 
                                placeholder="Nuevo blindaje externo (ej: Trenzado Nylon)" 
                                value={extName}
                                onChange={(e) => setExtName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <Button type="submit" variant="success" style={{ padding: '8px 15px' }}>Agregar</Button>
                    </form>

                    {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                        <table style={tableStyle}>
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
                                        <td style={{ ...tdStyle, textAlign: 'center', width: '80px' }}>
                                            <Button 
                                                onClick={() => b.id !== undefined && handleDeleteExterno(b.id)} 
                                                variant="danger" 
                                                style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* BLINDAJE INTERNO */}
                <div className="glass-panel" style={cardStyle}>
                    <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>Blindajes Internos</h3>
                    
                    <form onSubmit={handleSaveInterno} style={formStyle}>
                        <div style={{ flex: 1 }}>
                            <input 
                                type="text" 
                                placeholder="Nuevo blindaje interno (ej: Lámina Aluminio)" 
                                value={intName}
                                onChange={(e) => setIntName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <Button type="submit" variant="success" style={{ padding: '8px 15px' }}>Agregar</Button>
                    </form>

                    {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                        <table style={tableStyle}>
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
                                        <td style={{ ...tdStyle, textAlign: 'center', width: '80px' }}>
                                            <Button 
                                                onClick={() => b.id !== undefined && handleDeleteInterno(b.id)} 
                                                variant="danger" 
                                                style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                            >
                                                Eliminar
                                            </Button>
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

const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
};

const cardStyle: React.CSSProperties = {
    padding: '24px',
    height: 'fit-content'
};

const formStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
};

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse'
};

const headerRowStyle: React.CSSProperties = {
    borderBottom: '2px solid var(--border-color)',
    textAlign: 'left'
};

const thStyle: React.CSSProperties = {
    padding: '10px 5px',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase'
};

const rowStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--border-color)'
};

const tdStyle: React.CSSProperties = {
    padding: '10px 5px',
    fontSize: '0.9rem'
};
