import React, { useState, useEffect } from 'react';
import type { 
    ItemCreateDTO, RefMarca, RefEstado, RefColor, Contenedor, RefCategoriaItem, RefPuerto, RefProtocolo 
} from '../../types/Item.ts';
import { refService } from '../../services/refService.ts';
import { Button } from '../ui/Button.tsx';

interface ItemFormProps {
    onSave: (item: ItemCreateDTO) => Promise<void>;
    onCancel: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSave, onCancel }) => {
    // Datos maestros cargados de la DB
    const [marcas, setMarcas] = useState<RefMarca[]>([]);
    const [estados, setEstados] = useState<RefEstado[]>([]);
    const [colores, setColores] = useState<RefColor[]>([]);
    const [contenedores, setContenedores] = useState<Contenedor[]>([]);
    const [categoriasItem, setCategoriasItem] = useState<RefCategoriaItem[]>([]);
    const [_puertos, _setPuertos] = useState<RefPuerto[]>([]);
    const [_protocolos, _setProtocolos] = useState<RefProtocolo[]>([]);

    // Estado del formulario
    const [idEstado, setIdEstado] = useState<number>(0);
    const [idMarca, setIdMarca] = useState<number | undefined>(undefined);
    const [idContenedor, setIdContenedor] = useState<number>(0);
    const [selectedColores, setSelectedColores] = useState<number[]>([]);
    const [selectedCategorias, setSelectedCategorias] = useState<number[]>([]);
    
    // Conexiones
    const [conexiones, _setConexiones] = useState<{idPuerto: number, genero: boolean, idsProtocolos: number[]}[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const [m, e, c, cont, cat, p, prot] = await Promise.all([
                refService.getMarcas(),
                refService.getEstados(),
                refService.getColores(),
                refService.getContenedores(),
                refService.getCategoriasItem(),
                refService.getPuertos(),
                refService.getProtocolos()
            ]);
            setMarcas(m);
            setEstados(e);
            setColores(c);
            setContenedores(cont);
            setCategoriasItem(cat);
            _setPuertos(p);
            _setProtocolos(prot);
        };
        loadData();
    }, []);

    const handleAddMarca = async () => {
        const nombre = prompt("Nueva Marca:");
        if (nombre) {
            const nueva = await refService.saveMarca({ nombre });
            setMarcas([...marcas, nueva]);
            setIdMarca(nueva.id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dto: ItemCreateDTO = {
            idEstado,
            idMarca,
            idContenedor,
            idsColores: selectedColores,
            idsCategoriasItem: selectedCategorias,
            conexiones: conexiones
        };
        onSave(dto);
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div style={sectionStyle}>
                <h3>Información Básica</h3>
                
                <label style={labelStyle}>Estado:</label>
                <select value={idEstado} onChange={(e) => setIdEstado(Number(e.target.value))} required style={inputStyle}>
                    <option value="">Seleccione...</option>
                    {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>

                <label style={labelStyle}>Marca:</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <select value={idMarca} onChange={(e) => setIdMarca(Number(e.target.value))} style={inputStyle}>
                        <option value="">Ninguna</option>
                        {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </select>
                    <Button type="button" onClick={handleAddMarca}>+</Button>
                </div>

                <label style={labelStyle}>Contenedor:</label>
                <select value={idContenedor} onChange={(e) => setIdContenedor(Number(e.target.value))} required style={inputStyle}>
                    <option value="">Seleccione...</option>
                    {contenedores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>

                <label style={labelStyle}>Colores:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                    {colores.map(c => (
                        <label key={c.id} style={{ fontSize: '0.9em' }}>
                            <input 
                                type="checkbox" 
                                checked={selectedColores.includes(c.id!)}
                                onChange={(e) => {
                                    if (e.target.checked) setSelectedColores([...selectedColores, c.id!]);
                                    else setSelectedColores(selectedColores.filter(id => id !== c.id));
                                }}
                            /> {c.nombre}
                        </label>
                    ))}
                </div>

                <label style={labelStyle}>Categorías:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                    {categoriasItem.map(cat => (
                        <label key={cat.id} style={{ fontSize: '0.9em' }}>
                            <input 
                                type="checkbox" 
                                checked={selectedCategorias.includes(cat.id!)}
                                onChange={(e) => {
                                    if (e.target.checked) setSelectedCategorias([...selectedCategorias, cat.id!]);
                                    else setSelectedCategorias(selectedCategorias.filter(id => id !== cat.id));
                                }}
                            /> {cat.nombre}
                        </label>
                    ))}
                </div>
            </div>

            <div style={footerStyle}>
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" variant="success">Guardar Item</Button>
            </div>
        </form>
    );
};


const formStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
};

const sectionStyle: React.CSSProperties = {
    marginBottom: '20px'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
};
