import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refService } from '../../services/refService.ts';
import type { RefTipoContenedor } from '../../types/Item.ts';
import { Button } from '../../components/ui/Button.tsx';

export default function ContainerEditorPage() {
    const navigate = useNavigate();
    const [tipos, setTipos] = useState<RefTipoContenedor[]>([]);
    const [idTipo, setIdTipo] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await refService.getTiposContenedor();
                setTipos(data);
                if (data.length > 0) setIdTipo(data[0].id!);
            } catch (e) {
                console.error("Error al cargar tipos de contenedor", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idTipo) {
            alert("Debe seleccionar un tipo de contenedor");
            return;
        }

        try {
            await refService.saveContenedor({ tipoContenedor: { id: idTipo } });
            alert("Contenedor creado exitosamente");
            navigate('/admin/parametros');
        } catch (e) {
            console.error("Error al crear contenedor", e);
            alert("Error al crear el contenedor");
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#1a1a1a' }}>Nuevo Contenedor</h1>
                <p style={{ color: '#666' }}>Seleccione el tipo de contenedor para generar la nomenclatura automatica.</p>
            </header>

            <form onSubmit={handleSave} style={formStyle}>
                <label style={labelStyle}>Tipo de Contenedor:</label>
                <select 
                    value={idTipo} 
                    onChange={(e) => setIdTipo(Number(e.target.value))} 
                    required 
                    style={inputStyle}
                >
                    <option value="">Seleccione...</option>
                    {tipos.map(t => (
                        <option key={t.id} value={t.id}>
                            {t.nombre} ({t.prefijo})
                        </option>
                    ))}
                </select>

                <div style={footerStyle}>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
                    <Button type="submit" variant="success">Generar Contenedor</Button>
                </div>
            </form>
        </div>
    );
}

const formStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '25px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem'
};

const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px'
};
