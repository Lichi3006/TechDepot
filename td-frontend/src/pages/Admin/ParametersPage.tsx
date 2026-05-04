import React, { useState, useEffect } from 'react';
import { refService } from '../../services/refService.ts';
import type { RefBase, RefTipoContenedor, RefCategoriaFuncion } from '../../types/Item.ts';
import { Button } from '../../components/ui/Button.tsx';

export default function ParametersPage() {
    const [marcas, setMarcas] = useState<RefBase[]>([]);
    const [colores, setColores] = useState<RefBase[]>([]);
    const [estados, setEstados] = useState<RefBase[]>([]);
    const [contenedores, setContenedores] = useState<RefBase[]>([]);
    const [tiposContenedor, setTiposContenedor] = useState<RefTipoContenedor[]>([]);
    const [puertos, setPuertos] = useState<RefBase[]>([]);
    const [protocolos, setProtocolos] = useState<RefBase[]>([]);
    const [categoriasFuncion, setCategoriasFuncion] = useState<RefCategoriaFuncion[]>([]);

    const cargarTodos = async () => {
        // Cargamos cada uno por separado para que si uno falla no rompa el resto
        const safeLoad = async (fetcher: () => Promise<any>, setter: (data: any) => void, label: string) => {
            try {
                const data = await fetcher();
                setter(data);
            } catch (e) {
                console.error(`Error cargando ${label}:`, e);
            }
        };

        await Promise.all([
            safeLoad(refService.getMarcas, setMarcas, "Marcas"),
            safeLoad(refService.getColores, setColores, "Colores"),
            safeLoad(refService.getEstados, setEstados, "Estados"),
            safeLoad(refService.getContenedores, setContenedores, "Contenedores"),
            safeLoad(refService.getTiposContenedor, setTiposContenedor, "Tipos de Contenedor"),
            safeLoad(refService.getPuertos, setPuertos, "Puertos"),
            safeLoad(refService.getProtocolos, setProtocolos, "Protocolos"),
            safeLoad(refService.getCategoriasFuncion, setCategoriasFuncion, "Funciones")
        ]);
    };

    useEffect(() => {
        cargarTodos();
    }, []);

    const handleAdd = async (tipo: string) => {
        if (tipo === 'Contenedor') {
            if (tiposContenedor.length === 0) {
                alert("Primero debe crear al menos un Tipo de Contenedor");
                return;
            }
            const idTipo = prompt("Seleccione el ID del Tipo de Contenedor:\n" + 
                tiposContenedor.map(t => `${t.id}: ${t.nombre} (${t.prefijo})`).join('\n'));
            
            if (idTipo) {
                try {
                    await refService.saveContenedor({ tipoContenedor: { id: Number(idTipo) } });
                    cargarTodos();
                } catch (e) { alert("Error al guardar contenedor"); }
            }
            return;
        }

        if (tipo === 'TipoContenedor') {
            const nombre = prompt("Nombre del tipo (ej: Cables de Datos):");
            const prefijo = prompt("Prefijo (ej: DAT):");
            if (nombre && prefijo) {
                try {
                    await refService.saveTipoContenedor({ nombre, prefijo });
                    cargarTodos();
                } catch (e) { alert("Error al guardar tipo"); }
            }
            return;
        }

        const nombre = prompt(`Nuevo nombre para ${tipo}:`);
        if (!nombre) return;

        try {
            if (tipo === 'Marca') await refService.saveMarca({ nombre });
            if (tipo === 'Color') {
                const codigoHex = prompt("Ingrese el codigo HEX (ej: #FF5733):", "#000000");
                if (codigoHex) {
                    if (!/^#[0-9A-F]{6}$/i.test(codigoHex)) {
                        alert("Formato HEX invalido (debe ser #RRGGBB)");
                        return;
                    }
                    await refService.saveColor({ nombre, codigoHex });
                } else return;
            }
            if (tipo === 'Estado') await refService.saveEstado({ nombre });
            if (tipo === 'Puerto') await refService.savePuerto({ nombre });
            if (tipo === 'Funcion') await refService.saveCategoriaFuncion({ nombre });
            cargarTodos();
        } catch (e) {
            alert("Error al guardar");
        }
    };

    return (
        <div>
            <h1>Configuración de Parámetros</h1>
            <p>Gestioná las listas maestras que aparecen en los formularios.</p>

            <div style={gridStyle}>
                <ParameterList title="Estados" items={estados} onAdd={() => handleAdd('Estado')} />
                <ParameterList title="Funciones" items={categoriasFuncion} onAdd={() => handleAdd('Funcion')} />
                <ParameterList title="Puertos" items={puertos} onAdd={() => handleAdd('Puerto')} />
                <ParameterList title="Protocolos" items={protocolos} onAdd={() => { alert("Para agregar un protocolo, use el formulario avanzado (futuro)"); }} />
                <ParameterList title="Marcas" items={marcas} onAdd={() => handleAdd('Marca')} />
                <ParameterList title="Colores" items={colores} onAdd={() => handleAdd('Color')} />
                <ParameterList title="Tipos Contenedor" items={tiposContenedor} onAdd={() => handleAdd('TipoContenedor')} />
                <ParameterList title="Contenedores" items={contenedores} onAdd={() => handleAdd('Contenedor')} />
            </div>
        </div>
    );
}

const ParameterList = ({ title, items, onAdd }: { title: string, items: any[], onAdd: () => void }) => (
    <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <Button onClick={onAdd} variant="success" style={{ padding: '2px 8px' }}>+</Button>
        </div>
        <ul style={listStyle}>
            {items.map(i => (
                <li key={i.id} style={itemStyle}>
                    {i.codigoHex && <span style={{ ...miniSquareStyle, backgroundColor: i.codigoHex, display: 'inline-block', marginRight: '5px' }}></span>}
                    {i.nombre} {i.prefijo && `(${i.prefijo})`}
                </li>
            ))}
            {items.length === 0 && <li style={{ ...itemStyle, color: '#999' }}>Vacio o Error</li>}
        </ul>
    </div>
);

const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '30px'
};

const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '300px',
    overflowY: 'auto'
};

const itemStyle: React.CSSProperties = {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center'
};

const miniSquareStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    border: '1px solid #ddd'
};
