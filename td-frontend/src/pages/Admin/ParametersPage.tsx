import React, { useState, useEffect } from 'react';
import { refService } from '../../services/refService.ts';
import type { RefBase } from '../../types/Item.ts';
import { Button } from '../../components/ui/Button.tsx';

export default function ParametersPage() {
    const [marcas, setMarcas] = useState<RefBase[]>([]);
    const [colores, setColores] = useState<RefBase[]>([]);
    const [estados, setEstados] = useState<RefBase[]>([]);

    const cargarTodos = async () => {
        const [m, c, e] = await Promise.all([
            refService.getMarcas(),
            refService.getColores(),
            refService.getEstados()
        ]);
        setMarcas(m);
        setColores(c);
        setEstados(e);
    };

    useEffect(() => {
        cargarTodos();
    }, []);

    const handleAdd = async (tipo: string) => {
        const nombre = prompt(`Nuevo nombre para ${tipo}:`);
        if (!nombre) return;

        try {
            if (tipo === 'Marca') await refService.saveMarca({ nombre });
            if (tipo === 'Color') await refService.saveColor({ nombre });
            if (tipo === 'Estado') await refService.saveEstado({ nombre });
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
                <ParameterList title="Marcas" items={marcas} onAdd={() => handleAdd('Marca')} />
                <ParameterList title="Colores" items={colores} onAdd={() => handleAdd('Color')} />
                <ParameterList title="Estados" items={estados} onAdd={() => handleAdd('Estado')} />
            </div>
        </div>
    );
}

const ParameterList = ({ title, items, onAdd }: { title: string, items: RefBase[], onAdd: () => void }) => (
    <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <Button onClick={onAdd} variant="success" style={{ padding: '2px 8px' }}>+</Button>
        </div>
        <ul style={listStyle}>
            {items.map(i => (
                <li key={i.id} style={itemStyle}>{i.nombre}</li>
            ))}
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
    fontSize: '0.9rem'
};
