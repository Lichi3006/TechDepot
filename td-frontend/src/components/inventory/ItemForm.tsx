import React, { useState, useEffect } from 'react';
import type { 
    ItemCreateDTO, RefMarca, RefEstado, RefColor, Contenedor, RefPuerto, RefProtocolo, LinkPuertoCapacidad, RefBase 
} from '../../types/Item.ts';
import { refService } from '../../services/refService.ts';
import { Button } from '../ui/Button.tsx';
import { ColorPickerPalette } from '../shared/ColorPickerPalette.tsx';

interface ItemFormProps {
    onSave: (item: ItemCreateDTO) => Promise<void>;
    onCancel: () => void;
    initialData?: ItemCreateDTO;
    initialType?: ComponentType;
}

type ComponentType = 'CABLE' | 'FUENTE' | 'HARDWARE' | 'OTRO';

export const ItemForm: React.FC<ItemFormProps> = ({ onSave, onCancel, initialData, initialType }) => {
    const [marcas, setMarcas] = useState<RefMarca[]>([]);
    const [estados, setEstados] = useState<RefEstado[]>([]);
    const [coloresPresets, setColoresPresets] = useState<RefColor[]>([]);
    const [contenedores, setContenedores] = useState<Contenedor[]>([]);
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [protocolos, setProtocolos] = useState<RefProtocolo[]>([]);
    const [capacidades, setCapacidades] = useState<LinkPuertoCapacidad[]>([]);
    const [blindajesExt, setBlindajesExt] = useState<RefBase[]>([]);
    const [blindajesInt, setBlindajesInt] = useState<RefBase[]>([]);
    const [categoriasHardware, setCategoriasHardware] = useState<RefBase[]>([]);

    const [itemType, setItemType] = useState<ComponentType>(initialType || 'CABLE');
    const [idEstado, setIdEstado] = useState<number | undefined>(initialData?.idEstado);
    const [idMarca, setIdMarca] = useState<number | undefined>(initialData?.idMarca);
    const [idContenedor, setIdContenedor] = useState<number | undefined>(initialData?.idContenedor);
    const [selectedColoresHex, setSelectedColoresHex] = useState<string[]>(initialData?.coloresHex || []);
    const [selectedHardwareCats, setSelectedHardwareCats] = useState<number[]>(initialData?.detalleHardware?.idsCategoriasHardware || []);
    
    // Filtro de funciones para el selector de puertos
    const [selectedFilterFunction, setSelectedFilterFunction] = useState<number | null>(null);

    const getInitialConexiones = () => {
        if (!initialData?.conexiones) return [];
        
        const map = new Map<number, { idPuerto: number, idsCategoriasFuncion: number[], genero: boolean, idsProtocolos: number[] }>();
        
        initialData.conexiones.forEach(con => {
            const extId = (con as any).idExtremo ?? 0;
            if (!map.has(extId)) {
                map.set(extId, { 
                    idPuerto: con.idPuerto, 
                    idsCategoriasFuncion: [con.idCategoriaFuncion], 
                    genero: con.genero, 
                    idsProtocolos: con.idsProtocolos 
                });
            } else {
                const existing = map.get(extId)!;
                existing.idsCategoriasFuncion.push(con.idCategoriaFuncion);
                existing.idsProtocolos.push(...con.idsProtocolos);
                // Limpiar duplicados de protocolos si los hubiera
                existing.idsProtocolos = Array.from(new Set(existing.idsProtocolos));
            }
        });
        
        return Array.from(map.values());
    };

    const [conexiones, setConexiones] = useState(getInitialConexiones());

    const [largo, setLargo] = useState<number>(initialData?.detalleCable?.largo || 100);
    const [idBlindajeExt, setIdBlindajeExt] = useState<number>(initialData?.detalleCable?.idBlindajeExterno || 1);
    const [idBlindajeInt, setIdBlindajeInt] = useState<number | undefined>(initialData?.detalleCable?.idBlindajeInterno);
    const [voltaje, setVoltaje] = useState<number>(initialData?.detalleFuente?.voltaje || 0);
    const [amperaje, setAmperaje] = useState<number>(initialData?.detalleFuente?.amperaje || 0);
    const [amperajeMax, setAmperajeMax] = useState<number>(initialData?.detalleCable?.amperajeMax || 0);
    const [modeloAlfanumerico, setModeloAlfanumerico] = useState<string>(initialData?.detalleHardware?.modeloAlfanumerico || '');

    // ID del estado "Roto / Para reparar" (ID 4 en BD según seed data)
    const ID_ESTADO_ROTO = 4;

    // IDs de Categorías de Función
    const FUNCION_ENERGIA = 1;
    const FUNCION_DATOS = 2;
    const FUNCION_VIDEO = 3;
    const FUNCION_AUDIO = 4;
    const FUNCION_REDES = 5;

    // Efecto para inicializar y AJUSTAR conexiones según el tipo y estado
    useEffect(() => {
        const isRoto = idEstado === ID_ESTADO_ROTO;
        const targetMin = ((itemType === 'CABLE' || itemType === 'FUENTE') && !isRoto) ? 2 : 1;
        
        if (conexiones.length === 0) {
            const newConexiones = Array.from({ length: targetMin }, () => ({
                idPuerto: 0, 
                idsCategoriasFuncion: [], 
                genero: itemType === 'HARDWARE' ? false : true, // Default hembra para Hardware
                idsProtocolos: []
            }));
            setConexiones(newConexiones);
        } else if (conexiones.length < targetMin && !initialData) { // Solo auto-completamos si es creación
             const needed = targetMin - conexiones.length;
             const newConexiones = Array.from({ length: needed }, () => ({
                 idPuerto: 0, 
                 idsCategoriasFuncion: [], 
                 genero: itemType === 'HARDWARE' ? false : true, 
                 idsProtocolos: []
             }));
             setConexiones([...conexiones, ...newConexiones]);
        }
    }, [itemType, idEstado]);

    useEffect(() => {
        const loadData = async () => {
            const safeLoad = async (fetcher: () => Promise<any>, setter: (data: any) => void, label: string) => {
                try {
                    const data = await fetcher();
                    setter(data);
                    return data;
                } catch (e) {
                    console.error(`Error cargando ${label}:`, e);
                    return null;
                }
            };

            const [
                _m, _e, _c, _cont, _p, _prot, _cap, blExt, _blInt, _h
            ] = await Promise.all([
                safeLoad(refService.getMarcas, setMarcas, "Marcas"),
                safeLoad(refService.getEstados, setEstados, "Estados"),
                safeLoad(refService.getColores, setColoresPresets, "Colores"),
                safeLoad(refService.getContenedores, setContenedores, "Contenedores"),
                safeLoad(refService.getPuertos, setPuertos, "Puertos"),
                safeLoad(refService.getProtocolos, setProtocolos, "Protocolos"),
                safeLoad(refService.getPuertosCapacidades, setCapacidades, "Capacidades"),
                safeLoad(refService.getBlindajesExternos, setBlindajesExt, "Blindajes Ext"),
                safeLoad(refService.getBlindajesInternos, setBlindajesInt, "Blindajes Int"),
                safeLoad(refService.getCategoriasHardware, setCategoriasHardware, "Categorias Hardware")
            ]);

            // Set default to Goma if not editing and Goma exists
            if (!initialData?.detalleCable?.idBlindajeExterno && blExt) {
                const goma = blExt.find((b: RefBase) => b.nombre === 'Goma');
                if (goma) setIdBlindajeExt(goma.id!);
            }
        };
        loadData();
    }, []);

    const handleQuickAddMarca = async () => {
        const nombre = prompt("Ingrese el nombre de la nueva marca:");
        if (!nombre || !nombre.trim()) return;
        try {
            const nueva = await refService.saveMarca({ nombre: nombre.trim() });
            setMarcas(prev => [...prev, nueva]);
            setIdMarca(nueva.id);
            alert("Marca agregada correctamente.");
        } catch (e: any) {
            console.error("Error agregando marca:", e);
            alert(e.response?.data?.message || "Error al agregar marca.");
        }
    };

    const handleSaveColorPreset = async (nombre: string, codigoHex: string) => {
        try {
            const nuevo = await refService.saveColor({ nombre, codigoHex });
            setColoresPresets(prev => [...prev, nuevo]);
            setSelectedColoresHex(prev => [...prev, nuevo.codigoHex]);
            alert("Color agregado correctamente.");
        } catch (e: any) {
            console.error("Error agregando color:", e);
            alert(e.response?.data?.message || "Error al agregar color.");
        }
    };

    const getPuertosFiltrados = () => {
        let basePuertos = puertos;
        
        // Filtro por tipo de componente
        if (itemType === 'FUENTE') {
            const idsPuertosEnergia = capacidades
                .filter(cap => cap.categoriaFuncion.id === FUNCION_ENERGIA)
                .map(cap => cap.puerto.id);
            basePuertos = basePuertos.filter(p => idsPuertosEnergia.includes(p.id));
        }

        // Filtro manual por función (UI Selector)
        if (selectedFilterFunction) {
            const idsCompatibles = capacidades
                .filter(cap => cap.categoriaFuncion.id === selectedFilterFunction)
                .map(cap => cap.puerto.id);
            basePuertos = basePuertos.filter(p => idsCompatibles.includes(p.id));
        }
        
        return basePuertos;
    };

    const handleAddConexion = () => {
        setConexiones([...conexiones, { 
            idPuerto: 0, 
            idsCategoriasFuncion: [], 
            genero: itemType === 'HARDWARE' ? false : true, 
            idsProtocolos: [] 
        }]);
    };

    const updateConexion = (index: number, field: string, value: any) => {
        setConexiones(prev => {
            const newCons = [...prev];
            const con = { ...newCons[index], [field]: value };

            if (field === 'idPuerto') {
                const portCaps = capacidades.filter(cap => cap.puerto.id === value);
                
                if (itemType === 'FUENTE') {
                    con.idsCategoriasFuncion = [FUNCION_ENERGIA]; // Fuerza Energía
                } else if (portCaps.length === 1) {
                    con.idsCategoriasFuncion = [portCaps[0].categoriaFuncion.id!];
                } else {
                    con.idsCategoriasFuncion = []; 
                }
                con.idsProtocolos = [];
            }

            if (field === 'idCategoriaFuncion') {
                // Si ya está, lo quitamos. Si no, lo agregamos (soporte multifunción)
                const current = con.idsCategoriasFuncion;
                if (current.includes(value)) {
                    con.idsCategoriasFuncion = current.filter(id => id !== value);
                    // Si quitamos una función, también quitamos sus protocolos asociados
                    const protocolsOfThisFunction = protocolos.filter(p => p.categoriaFuncion.id === value).map(p => p.id);
                    con.idsProtocolos = con.idsProtocolos.filter(id => !protocolsOfThisFunction.includes(id));
                } else {
                    con.idsCategoriasFuncion = [...current, value];
                }
            }

            if (field === 'idsProtocolos') {
                // value ya viene como el nuevo array completo de IDs
                con.idsProtocolos = value;
                
                // Aseguramos que las categorías de todos los protocolos seleccionados estén en idsCategoriasFuncion
                const categoriesFromProtocols = value.map((idProt: number) => {
                    return protocolos.find(p => p.id === idProt)?.categoriaFuncion.id;
                }).filter(Boolean);

                // Unión de las categorías manuales previas y las derivadas de los protocolos
                con.idsCategoriasFuncion = Array.from(new Set([...con.idsCategoriasFuncion, ...categoriesFromProtocols]));
            }

            newCons[index] = con;
            return newCons;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!idEstado) return alert("El estado es obligatorio");
        if (!idContenedor) return alert("El contenedor es obligatorio");
        if (conexiones.length === 0) return alert("Debe agregar al menos una conexión");

        if (conexiones.some(c => c.idsCategoriasFuncion.length === 0)) {
            alert("Hay conexiones sin función definida. Seleccione un protocolo o función manual.");
            return;
        }

        // El backend espera una conexión por CategoriaFuncion
        // Si un puerto tiene 3 funciones, enviamos 3 objetos de conexión al backend
        const conexionesExpandidas = conexiones.flatMap((con, index) => 
            con.idsCategoriasFuncion.map(idFun => ({
                idExtremo: index, // Agregamos índice para agrupar por extremo físico
                idPuerto: con.idPuerto,
                idCategoriaFuncion: idFun,
                genero: con.genero,
                idsProtocolos: protocolos
                    .filter(p => p.puerto.id === con.idPuerto && p.categoriaFuncion.id === idFun && con.idsProtocolos.includes(p.id!))
                    .map(p => p.id!)
            }))
        );

        const dto: ItemCreateDTO = {
            idEstado: idEstado!,
            idMarca: idMarca,
            idContenedor: idContenedor!,
            coloresHex: selectedColoresHex,
            conexiones: conexionesExpandidas,
            detalleCable: (itemType === 'CABLE' || itemType === 'FUENTE') ? { 
                largo, 
                idBlindajeExterno: idBlindajeExt, 
                idBlindajeInterno: idBlindajeInt,
                amperajeMax: itemType === 'FUENTE' ? amperajeMax : undefined 
            } : undefined,
            detalleFuente: itemType === 'FUENTE' ? { amperaje, voltaje } : undefined,
            detalleHardware: itemType === 'HARDWARE' ? { modeloAlfanumerico, idsCategoriasHardware: selectedHardwareCats } : undefined
        };
        onSave(dto);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={formStyle}>
            {/* 1. TIPO DE COMPONENTE (AHORA PRIMERO) */}
            <div style={sectionStyle}>
                <label style={labelStyle}>Tipo de Componente:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {(['CABLE', 'FUENTE', 'HARDWARE', 'OTRO'] as const).map(t => (
                        <Button 
                            key={t} 
                            type="button" 
                            variant={itemType === t ? 'success' : 'secondary'} 
                            onClick={() => {
                                setItemType(t);
                                // Inicializamos con 2 conexiones para CABLE/FUENTE, 1 para el resto
                                const initialCount = (t === 'CABLE' || t === 'FUENTE') ? 2 : 1;
                                const initialConexiones = Array.from({ length: initialCount }, () => ({
                                    idPuerto: 0, 
                                    idsCategoriasFuncion: [], 
                                    genero: t === 'HARDWARE' ? false : true, 
                                    idsProtocolos: []
                                }));
                                setConexiones(initialConexiones);
                            }} 
                            style={{ flex: 1 }}
                        >
                            {t}
                        </Button>
                    ))}
                </div>
            </div>

            {/* 2. INFORMACION BASICA */}
            <div style={sectionStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Informacion Basica</h3>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Estado:</label>
                        <select value={idEstado || ""} onChange={(e) => setIdEstado(Number(e.target.value))} required style={inputStyle}>
                            <option value="">Seleccione...</option>
                            {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Marca:</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <select value={idMarca || ""} onChange={(e) => setIdMarca(Number(e.target.value))} style={{ ...inputStyle, flex: 1 }}>
                                <option value="">Generica / Ninguna</option>
                                {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                            </select>
                            <Button 
                                type="button" 
                                variant="success" 
                                onClick={handleQuickAddMarca}
                                style={{ padding: '0 12px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Contenedor:</label>
                        <select value={idContenedor || ""} onChange={(e) => setIdContenedor(Number(e.target.value))} required style={inputStyle}>
                            <option value="">Seleccione...</option>
                            {contenedores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                </div>

                <label style={labelStyle}>Colores:</label>
                <ColorPickerPalette 
                    selectedColors={selectedColoresHex} 
                    presets={coloresPresets} 
                    onChange={setSelectedColoresHex} 
                    onSavePreset={handleSaveColorPreset}
                />
            </div>

            {/* 3. CONEXIONES (FILTRADAS) */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ color: 'var(--text-primary)' }}>Conexiones y Extremos</h3>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Button type="button" onClick={handleAddConexion} variant="success">+ Agregar Extremo</Button>
                    </div>
                </div>

                <div style={{ marginBottom: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Filtrar Puertos por:</span>
                    <button type="button" onClick={() => setSelectedFilterFunction(null)} style={selectedFilterFunction === null ? activeFilterStyle : filterStyle}>Todos</button>
                    <button type="button" onClick={() => setSelectedFilterFunction(FUNCION_ENERGIA)} style={selectedFilterFunction === FUNCION_ENERGIA ? activeFilterStyle : filterStyle}>Energía</button>
                    <button type="button" onClick={() => setSelectedFilterFunction(FUNCION_DATOS)} style={selectedFilterFunction === FUNCION_DATOS ? activeFilterStyle : filterStyle}>Datos</button>
                    <button type="button" onClick={() => setSelectedFilterFunction(FUNCION_VIDEO)} style={selectedFilterFunction === FUNCION_VIDEO ? activeFilterStyle : filterStyle}>Video</button>
                    <button type="button" onClick={() => setSelectedFilterFunction(FUNCION_AUDIO)} style={selectedFilterFunction === FUNCION_AUDIO ? activeFilterStyle : filterStyle}>Audio</button>
                    <button type="button" onClick={() => setSelectedFilterFunction(FUNCION_REDES)} style={selectedFilterFunction === FUNCION_REDES ? activeFilterStyle : filterStyle}>Redes</button>
                </div>
                
                {conexiones.map((con, index) => {
                    const filteredPorts = getPuertosFiltrados();
                    let portCaps = capacidades.filter(cap => cap.puerto.id === con.idPuerto);
                    
                    if (itemType === 'FUENTE') {
                        // Para fuentes solo mostramos la capacidad de Energía (ID 1)
                        portCaps = portCaps.filter(cap => cap.categoriaFuncion.id === FUNCION_ENERGIA);
                    }
                    
                    return (
                        <div key={index} style={conexionCardStyle}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 100px 40px', gap: '15px', alignItems: 'end' }}>
                                <div>
                                    <label style={smallLabelStyle}>Puerto:</label>
                                    <select value={con.idPuerto} onChange={(e) => updateConexion(index, 'idPuerto', Number(e.target.value))} style={inputStyle}>
                                        <option value="0">Seleccione...</option>
                                        {filteredPorts.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={smallLabelStyle}>Protocolos / Función:</label>
                                    {con.idPuerto === 0 ? (
                                        <div style={{ padding: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Seleccione un puerto</div>
                                    ) : (
                                        <div style={protocolGridStyle}>
                                            {portCaps.map(cap => {
                                                const capsProts = protocolos.filter(p => p.puerto.id === con.idPuerto && p.categoriaFuncion.id === cap.categoriaFuncion.id);
                                                const isFunctionActive = con.idsCategoriasFuncion.includes(cap.categoriaFuncion.id!);
                                                
                                                if (capsProts.length > 0) {
                                                    // Categoría con protocolos
                                                    return (
                                                        <div key={cap.categoriaFuncion.id} style={{ gridColumn: '1 / span 2', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', marginBottom: '4px' }}>
                                                            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>{cap.categoriaFuncion.nombre}</div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                                                                {capsProts.map(p => (
                                                                    <label key={p.id} style={checkboxLabelStyle}>
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={con.idsProtocolos.includes(p.id!)}
                                                                            onChange={(e) => {
                                                                                const newIds = e.target.checked 
                                                                                    ? [...con.idsProtocolos, p.id!]
                                                                                    : con.idsProtocolos.filter(id => id !== p.id);
                                                                                updateConexion(index, 'idsProtocolos', newIds);
                                                                            }}
                                                                        /> <span style={{color: 'var(--text-primary)'}}>{p.nombre}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    // Función sin protocolos (bare function)
                                                    return (
                                                        <label key={cap.categoriaFuncion.id} style={{ ...checkboxLabelStyle, gridColumn: '1 / span 2' }}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isFunctionActive}
                                                                onChange={() => updateConexion(index, 'idCategoriaFuncion', cap.categoriaFuncion.id!)}
                                                            /> <span style={{color: 'var(--text-primary)'}}>{cap.categoriaFuncion.nombre}</span>
                                                        </label>
                                                    );
                                                }
                                            })}
                                            {portCaps.length === 0 && <div style={{ padding: '8px', color: 'var(--danger-color)', fontSize: '0.85rem', gridColumn: '1 / span 2' }}>Sin capacidades configuradas</div>}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={smallLabelStyle}>Género:</label>
                                    <select value={con.genero ? 'M' : 'H'} onChange={(e) => updateConexion(index, 'genero', e.target.value === 'M')} style={inputStyle}>
                                        <option value="M">Macho</option>
                                        <option value="H">Hembra</option>
                                    </select>
                                </div>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setConexiones(conexiones.filter((_, i) => i !== index))} 
                                    style={{ padding: '8px', opacity: (conexiones.length <= (((itemType === 'CABLE' || itemType === 'FUENTE') && idEstado !== ID_ESTADO_ROTO) ? 2 : 1)) ? 0.5 : 1 }}
                                    disabled={conexiones.length <= (((itemType === 'CABLE' || itemType === 'FUENTE') && idEstado !== ID_ESTADO_ROTO) ? 2 : 1)}
                                >
                                    X
                                </Button>
                            </div>
                        </div>
                    );
                })}
                {conexiones.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Primero debe elegir el tipo de componente arriba y agregar sus conexiones.</p>}
            </div>

            {/* 4. ESPECIFICACIONES TÉCNICAS */}
            <div style={sectionStyle}>
                <h3 style={{ color: 'var(--text-primary)' }}>Especificaciones Técnicas</h3>
                <div style={gridStyle}>
                    {(itemType === 'CABLE' || itemType === 'FUENTE') && (
                        <>
                            <div>
                                <label style={labelStyle}>Largo (cm):</label>
                                <input type="number" value={largo} onChange={(e) => setLargo(Number(e.target.value))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Blindaje Ext:</label>
                                <select value={idBlindajeExt} onChange={(e) => setIdBlindajeExt(Number(e.target.value))} style={inputStyle}>
                                    {blindajesExt
                                        .filter(b => {
                                            const isNetworkShield = b.nombre.includes('UTP') || b.nombre.includes('STP') || b.nombre.includes('FTP');
                                            const isNetworkItem = conexiones.some(c => c.idsCategoriasFuncion.includes(FUNCION_REDES));
                                            return isNetworkItem ? isNetworkShield || ['PVC', 'Goma'].includes(b.nombre) : !isNetworkShield;
                                        })
                                        .map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Blindaje Int:</label>
                                <select value={idBlindajeInt || ""} onChange={(e) => setIdBlindajeInt(e.target.value ? Number(e.target.value) : undefined)} style={inputStyle}>
                                    <option value="">Ninguno</option>
                                    {blindajesInt.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                    {itemType === 'FUENTE' && (
                        <>
                            <div>
                                <label style={labelStyle}>Voltaje (V):</label>
                                <input type="number" value={voltaje} onChange={(e) => setVoltaje(Number(e.target.value))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Amperaje (A):</label>
                                <input type="number" value={amperaje} onChange={(e) => setAmperaje(Number(e.target.value))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Amp. Max (Pico):</label>
                                <input type="number" value={amperajeMax} onChange={(e) => setAmperajeMax(Number(e.target.value))} style={inputStyle} />
                            </div>
                        </>
                    )}
                    {itemType === 'HARDWARE' && (
                        <>
                            <div>
                                <label style={labelStyle}>Categoría Hardware:</label>
                                <select 
                                    value={selectedHardwareCats.length > 0 ? selectedHardwareCats[0] : ""} 
                                    onChange={(e) => setSelectedHardwareCats([Number(e.target.value)])} 
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    {categoriasHardware.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Modelo / SN:</label>
                                <input type="text" value={modeloAlfanumerico} onChange={(e) => setModeloAlfanumerico(e.target.value)} style={inputStyle} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div style={footerStyle}>
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" variant="success">Guardar Item Completo</Button>
            </div>
        </form>
    );
};

const formStyle: React.CSSProperties = { padding: '25px', marginBottom: '30px' };
const sectionStyle: React.CSSProperties = { marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '15px' };
const conexionCardStyle: React.CSSProperties = { padding: '15px', backgroundColor: 'var(--surface-color)', borderRadius: '8px', marginBottom: '12px', border: '1px solid var(--border-color)' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' };
const smallLabelStyle: React.CSSProperties = { fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '5px', display: 'block' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' };
const protocolGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', maxHeight: '100px', overflowY: 'auto', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--input-bg)' };
const checkboxLabelStyle: React.CSSProperties = { fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--text-primary)' };
const footerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' };

const filterStyle: React.CSSProperties = {
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const activeFilterStyle: React.CSSProperties = {
    ...filterStyle,
    backgroundColor: 'var(--brand-color)',
    color: '#000',
    border: '1px solid var(--brand-color)'
};
