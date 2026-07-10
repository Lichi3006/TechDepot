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
                <h1 className="admin-title">Gestión de Blindajes de Cables</h1>
                <p className="admin-description">Administrá las propiedades físicas de aislamiento para los cables del inventario.</p>
            </header>

            <div className="admin-grid">
                {/* BLINDAJE EXTERNO */}
                <div className="glass-panel admin-card">
                    <h3 className="admin-subtitle">Blindajes Externos</h3>
                    
                    <form onSubmit={handleSaveExterno} className="admin-form-row">
                        <div className="admin-input-wrapper">
                            <input 
                                type="text" 
                                placeholder="Nuevo blindaje externo (ej: Trenzado Nylon)" 
                                value={extName}
                                onChange={(e) => setExtName(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" variant="success" style={{ padding: '8px 15px' }}>Agregar</Button>
                    </form>

                    {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th style={{ textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {externos.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.nombre}</td>
                                        <td>
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
                    <h3 className="admin-subtitle">Blindajes Internos</h3>
                    
                    <form onSubmit={handleSaveInterno} className="admin-form-row">
                        <div className="admin-input-wrapper">
                            <input 
                                type="text" 
                                placeholder="Nuevo blindaje interno (ej: Lámina Aluminio)" 
                                value={intName}
                                onChange={(e) => setIntName(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" variant="success" style={{ padding: '8px 15px' }}>Agregar</Button>
                    </form>

                    {loading ? <p style={{ color: 'var(--brand-color)' }}>Cargando...</p> : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th style={{ textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internos.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.nombre}</td>
                                        <td>
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
