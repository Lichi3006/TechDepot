import React, { useState, useEffect } from 'react';
import type { 
    ItemCreateDTO, RefMarca, RefEstado, RefColor, Contenedor, RefCategoriaFuncion, RefPuerto, RefProtocolo 
} from '../../types/Item.ts';
import { refService } from '../../services/refService.ts';
import { Button } from '../ui/Button.tsx';
import { ColorPickerPalette } from '../shared/ColorPickerPalette.tsx';

interface ItemFormProps {
    onSave: (item: ItemCreateDTO) => Promise<void>;
    onCancel: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSave, onCancel }) => {
    const [marcas, setMarcas] = useState<RefMarca[]>([]);
    const [estados, setEstados] = useState<RefEstado[]>([]);
    const [coloresPresets, setColoresPresets] = useState<RefColor[]>([]);
    const [contenedores, setContenedores] = useState<Contenedor[]>([]);
    const [categoriasFuncion, setCategoriasFuncion] = useState<RefCategoriaFuncion[]>([]);
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [_protocolos, _setProtocolos] = useState<RefProtocolo[]>([]);

    const [idEstado, setIdEstado] = useState<number>(0);
    const [idMarca, setIdMarca] = useState<number | undefined>(undefined);
    const [idContenedor, setIdContenedor] = useState<number>(0);
    const [selectedColoresHex, setSelectedColoresHex] = useState<string[]>([]);
    
    // Conexiones (Mínimo 1 para items básicos)
    const [conexiones, setConexiones] = useState<{idPuerto: number, idCategoriaFuncion: number, genero: boolean, idsProtocolos: number[]}[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [m, e, c, cont, cf, p, prot] = await Promise.all([
                    refService.getMarcas(),
                    refService.getEstados(),
                    refService.getColores(),
                    refService.getContenedores(),
                    refService.getCategoriasFuncion(),
                    refService.getPuertos(),
                    refService.getProtocolos()
                ]);
                setMarcas(m);
                setEstados(e);
                setColoresPresets(c);
                setContenedores(cont);
                setCategoriasFuncion(cf);
                setPuertos(p);
                _setProtocolos(prot);
            } catch (error) {
                console.error("Error al cargar datos del formulario:", error);
            }
        };
        loadData();
    }, []);

    const handleAddConexion = () => {
        setConexiones([...conexiones, { idPuerto: 0, idCategoriaFuncion: 0, genero: true, idsProtocolos: [] }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dto: ItemCreateDTO = {
            idEstado,
            idMarca,
            idContenedor,
            coloresHex: selectedColoresHex,
            idsCategoriasItem: [], // Obsoleto
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
                <select value={idMarca} onChange={(e) => setIdMarca(Number(e.target.value))} style={inputStyle}>
                    <option value="">Ninguna / Generica</option>
                    {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>

                <label style={labelStyle}>Contenedor:</label>
                <select value={idContenedor} onChange={(e) => setIdContenedor(Number(e.target.value))} required style={inputStyle}>
                    <option value="">Seleccione...</option>
                    {contenedores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>

                <label style={labelStyle}>Colores:</label>
                <ColorPickerPalette 
                    selectedColors={selectedColoresHex} 
                    presets={coloresPresets} 
                    onChange={setSelectedColoresHex} 
                />
            </div>

            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Conexiones y Extremos</h3>
                    <Button type="button" onClick={handleAddConexion} variant="success">+ Agregar Extremo</Button>
                </div>
                
                {conexiones.map((con, index) => (
                    <div key={index} style={conexionCardStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '10px' }}>
                            <div>
                                <label style={smallLabelStyle}>Puerto:</label>
                                <select 
                                    value={con.idPuerto} 
                                    onChange={(e) => {
                                        const newCons = [...conexiones];
                                        newCons[index].idPuerto = Number(e.target.value);
                                        setConexiones(newCons);
                                    }}
                                    style={inputStyle}
                                >
                                    <option value="0">Seleccione...</option>
                                    {puertos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={smallLabelStyle}>Funcion:</label>
                                <select 
                                    value={con.idCategoriaFuncion} 
                                    onChange={(e) => {
                                        const newCons = [...conexiones];
                                        newCons[index].idCategoriaFuncion = Number(e.target.value);
                                        setConexiones(newCons);
                                    }}
                                    style={inputStyle}
                                >
                                    <option value="0">Seleccione...</option>
                                    {categoriasFuncion.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={smallLabelStyle}>Genero:</label>
                                <select 
                                    value={con.genero ? 'M' : 'H'} 
                                    onChange={(e) => {
                                        const newCons = [...conexiones];
                                        newCons[index].genero = e.target.value === 'M';
                                        setConexiones(newCons);
                                    }}
                                    style={inputStyle}
                                >
                                    <option value="M">Macho</option>
                                    <option value="H">Hembra</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
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
    marginBottom: '30px',
    borderBottom: '1px solid #eee',
    paddingBottom: '20px'
};

const conexionCardStyle: React.CSSProperties = {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    marginBottom: '10px',
    border: '1px solid #eee'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
};

const smallLabelStyle: React.CSSProperties = {
    fontSize: '0.85em',
    display: 'block',
    marginBottom: '3px'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
};
