import React, { useState, useEffect } from 'react';
import type { 
    ItemCreateDTO, RefMarca, RefEstado, RefColor, Contenedor, RefPuerto, RefProtocolo, LinkPuertoCapacidad 
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
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [protocolos, setProtocolos] = useState<RefProtocolo[]>([]);
    const [capacidades, setCapacidades] = useState<LinkPuertoCapacidad[]>([]);

    // Estados con null/undefined para indicar "no seleccionado"
    const [idEstado, setIdEstado] = useState<number | undefined>(undefined);
    const [idMarca, setIdMarca] = useState<number | undefined>(undefined);
    const [idContenedor, setIdContenedor] = useState<number | undefined>(undefined);
    const [selectedColoresHex, setSelectedColoresHex] = useState<string[]>([]);
    
    const [conexiones, setConexiones] = useState<{
        idPuerto: number, 
        idCategoriaFuncion: number, 
        genero: boolean, 
        idsProtocolos: number[]
    }[]>([]);

    useEffect(() => {
        const loadData = async () => {
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
                safeLoad(refService.getEstados, setEstados, "Estados"),
                safeLoad(refService.getColores, setColoresPresets, "Colores"),
                safeLoad(refService.getContenedores, setContenedores, "Contenedores"),
                safeLoad(refService.getPuertos, setPuertos, "Puertos"),
                safeLoad(refService.getProtocolos, setProtocolos, "Protocolos"),
                safeLoad(refService.getPuertosCapacidades, setCapacidades, "Capacidades")
            ]);
        };
        loadData();
    }, []);

    const handleAddConexion = () => {
        setConexiones([...conexiones, { idPuerto: 0, idCategoriaFuncion: 0, genero: true, idsProtocolos: [] }]);
    };

    const updateConexion = (index: number, field: string, value: any) => {
        const newCons = [...conexiones];
        const con = { ...newCons[index], [field]: value };

        if (field === 'idPuerto') {
            const portCaps = capacidades.filter(cap => cap.puerto.id === value);
            if (portCaps.length === 1) {
                con.idCategoriaFuncion = portCaps[0].categoriaFuncion.id!;
            } else {
                con.idCategoriaFuncion = 0;
            }
            con.idsProtocolos = [];
        }

        if (field === 'idsProtocolos') {
            if (value.length > 0) {
                const prot = protocolos.find(p => p.id === value[0]);
                if (prot) con.idCategoriaFuncion = prot.categoriaFuncion.id!;
            }
        }

        newCons[index] = con;
        setConexiones(newCons);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!idEstado) return alert("El estado es obligatorio");
        if (!idContenedor) return alert("El contenedor es obligatorio");

        if (conexiones.some(c => c.idCategoriaFuncion === 0)) {
            alert("Hay conexiones con funcion ambigua. Seleccione un protocolo para definir que hace el puerto.");
            return;
        }

        const dto: ItemCreateDTO = {
            idEstado: idEstado!,
            idMarca: idMarca || undefined, // Evitamos mandar 0
            idContenedor: idContenedor!,
            coloresHex: selectedColoresHex,
            conexiones: conexiones.map(c => ({
                ...c,
                idsProtocolos: c.idsProtocolos
            }))
        };
        
        onSave(dto);
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div style={sectionStyle}>
                <h3>Informacion Basica</h3>
                
                <label style={labelStyle}>Estado:</label>
                <select 
                    value={idEstado || ""} 
                    onChange={(e) => setIdEstado(e.target.value ? Number(e.target.value) : undefined)} 
                    required 
                    style={inputStyle}
                >
                    <option value="">Seleccione...</option>
                    {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>

                <label style={labelStyle}>Marca:</label>
                <select 
                    value={idMarca || ""} 
                    onChange={(e) => setIdMarca(e.target.value ? Number(e.target.value) : undefined)} 
                    style={inputStyle}
                >
                    <option value="">Ninguna / Generica</option>
                    {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>

                <label style={labelStyle}>Contenedor:</label>
                <select 
                    value={idContenedor || ""} 
                    onChange={(e) => setIdContenedor(e.target.value ? Number(e.target.value) : undefined)} 
                    required 
                    style={inputStyle}
                >
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
                
                {conexiones.map((con, index) => {
                    const availableProtocols = protocolos.filter(p => p.puerto.id === con.idPuerto);
                    const currentFunction = capacidades.find(c => c.categoriaFuncion.id === con.idCategoriaFuncion)?.categoriaFuncion;

                    return (
                        <div key={index} style={conexionCardStyle}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '10px' }}>
                                <div>
                                    <label style={smallLabelStyle}>Puerto:</label>
                                    <select 
                                        value={con.idPuerto} 
                                        onChange={(e) => updateConexion(index, 'idPuerto', Number(e.target.value))}
                                        style={inputStyle}
                                    >
                                        <option value="0">Seleccione...</option>
                                        {puertos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={smallLabelStyle}>Protocolo (Opcional):</label>
                                    <select 
                                        multiple
                                        value={con.idsProtocolos.map(String)} 
                                        onChange={(e) => {
                                            const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                                            updateConexion(index, 'idsProtocolos', values);
                                        }}
                                        style={{ ...inputStyle, height: '60px' }}
                                        disabled={con.idPuerto === 0}
                                    >
                                        {availableProtocols.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={smallLabelStyle}>Genero:</label>
                                    <select 
                                        value={con.genero ? 'M' : 'H'} 
                                        onChange={(e) => updateConexion(index, 'genero', e.target.value === 'M')}
                                        style={inputStyle}
                                    >
                                        <option value="M">Macho</option>
                                        <option value="H">Hembra</option>
                                    </select>
                                </div>
                            </div>
                            {con.idCategoriaFuncion !== 0 && (
                                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#2e7d32' }}>
                                    <strong>Funcion detectada:</strong> {currentFunction?.nombre}
                                </div>
                            )}
                        </div>
                    );
                })}
                {conexiones.length === 0 && <p style={{ color: '#666' }}>No hay conexiones agregadas.</p>}
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
