import React, { useEffect, useState } from 'react';
import { refService } from '../../services/refService';
import type { ItemFilterDTO } from '../../services/itemService';
import type { RefBase, RefMarca, RefEstado, RefCategoriaFuncion, RefPuerto, LinkPuertoCapacidad } from '../../types/Item';

interface FilterSidebarProps {
    onFilterChange: (filters: ItemFilterDTO) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
    const [marcas, setMarcas] = useState<RefMarca[]>([]);
    const [estados, setEstados] = useState<RefEstado[]>([]);
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [funciones, setFunciones] = useState<RefCategoriaFuncion[]>([]);
    const [catHw, setCatHw] = useState<RefBase[]>([]);
    const [capacidades, setCapacidades] = useState<LinkPuertoCapacidad[]>([]);

    const [isExpanded, setIsExpanded] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState<ItemFilterDTO>({
        idsMarcas: [],
        idsEstados: [],
        idsPuertos: [],
        idsCategoriasFuncion: [],
        idsCategoriasHardware: [],
        query: ''
    });

    useEffect(() => {
        const loadRefs = async () => {
            const [m, e, p, f, h, c] = await Promise.all([
                refService.getMarcas(),
                refService.getEstados(),
                refService.getPuertos(),
                refService.getCategoriasFuncion(),
                refService.getCategoriasHardware(),
                refService.getPuertosCapacidades()
            ]);
            setMarcas(m);
            setEstados(e);
            setPuertos(p);
            setFunciones(f);
            setCatHw(h);
            setCapacidades(c);
        };
        loadRefs();
    }, []);

    const updateFilters = (newFilters: ItemFilterDTO) => {
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleCheckboxChange = (category: keyof ItemFilterDTO, id: number) => {
        const currentIds = (selectedFilters[category] as number[]) || [];
        const newIds = currentIds.includes(id)
            ? currentIds.filter(item => item !== id)
            : [...currentIds, id];
        
        updateFilters({ ...selectedFilters, [category]: newIds });
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilters({ ...selectedFilters, query: e.target.value });
    };

    const resetFilters = () => {
        updateFilters({
            idsMarcas: [],
            idsEstados: [],
            idsPuertos: [],
            idsCategoriasFuncion: [],
            idsCategoriasHardware: [],
            query: ''
        });
    };

    return (
        <div className="glass-panel" style={{
            ...sidebarContainerStyle, 
            width: isExpanded ? '266px' : '60px',
            padding: isExpanded ? '20px' : '20px 10px',
            alignItems: isExpanded ? 'stretch' : 'center'
        }}>
            {!isExpanded ? (
                <button onClick={() => setIsExpanded(true)} style={collapsedButtonStyle}>
                    <div style={{ ...closeButtonStyle, marginBottom: '15px', padding: '6px 8px' }}>▶</div>
                    <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: 'bold', color: 'var(--brand-color)', letterSpacing: '2px' }}>FILTROS</span>
                </button>
            ) : (
                <>
                    <div style={headerStyle}>
                        <h3 style={titleStyle}>Filtros</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={resetFilters} style={resetButtonStyle}>Limpiar</button>
                            <button onClick={() => setIsExpanded(false)} style={closeButtonStyle}>◀</button>
                        </div>
                    </div>

                    <div style={searchContainerStyle}>
                        <label style={labelHeaderStyle}>Búsqueda rápida</label>
                        <input 
                            type="text" 
                            placeholder="Marca, modelo..." 
                            value={selectedFilters.query}
                            onChange={handleQueryChange}
                            style={inputStyle}
                        />
                    </div>

                    <FilterSection 
                        title="Marcas" 
                        items={marcas} 
                        selectedIds={selectedFilters.idsMarcas || []} 
                        onChange={(id) => handleCheckboxChange('idsMarcas', id)} 
                    />

                    <FilterSection 
                        title="Estados" 
                        items={estados} 
                        selectedIds={selectedFilters.idsEstados || []} 
                        onChange={(id) => handleCheckboxChange('idsEstados', id)} 
                    />

                    <PortFilterSection 
                        title="Puertos" 
                        items={puertos} 
                        funciones={funciones}
                        capacidades={capacidades}
                        selectedIds={selectedFilters.idsPuertos || []} 
                        onChange={(id) => handleCheckboxChange('idsPuertos', id)} 
                    />

                    <FilterSection 
                        title="Funciones" 
                        items={funciones} 
                        selectedIds={selectedFilters.idsCategoriasFuncion || []} 
                        onChange={(id) => handleCheckboxChange('idsCategoriasFuncion', id)} 
                    />

                    <FilterSection 
                        title="Hardware" 
                        items={catHw} 
                        selectedIds={selectedFilters.idsCategoriasHardware || []} 
                        onChange={(id) => handleCheckboxChange('idsCategoriasHardware', id)} 
                    />
                </>
            )}
        </div>
    );
};

const FilterSection: React.FC<{ 
    title: string, 
    items: RefBase[], 
    selectedIds: number[], 
    onChange: (id: number) => void 
}> = ({ title, items, selectedIds, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredItems = items.filter(i => 
        i.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={sectionCardStyle}>
            <h4 style={sectionTitleStyle}>{title}</h4>
            {items.length > 8 && (
                <input 
                    type="text" 
                    placeholder={`Filtrar ${title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={miniInputStyle}
                />
            )}
            <div style={optionsContainerStyle}>
                {filteredItems.map(item => (
                    <label key={item.id} style={optionLabelStyle}>
                        <div style={checkboxWrapperStyle(selectedIds.includes(item.id!))}>
                            {selectedIds.includes(item.id!) && <span style={checkmarkStyle}>✓</span>}
                        </div>
                        <input 
                            type="checkbox" 
                            checked={selectedIds.includes(item.id!)} 
                            onChange={() => onChange(item.id!)}
                            style={{ display: 'none' }} // Ocultamos el nativo
                        />
                        <span style={optionTextStyle(selectedIds.includes(item.id!))}>{item.nombre}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const PortFilterSection: React.FC<{ 
    title: string, 
    items: RefPuerto[], 
    funciones: RefCategoriaFuncion[],
    capacidades: LinkPuertoCapacidad[],
    selectedIds: number[], 
    onChange: (id: number) => void 
}> = ({ title, items, funciones, capacidades, selectedIds, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
    
    let filteredItems = items;
    
    // Primero filtramos por categoría (función)
    if (selectedCatId) {
        const validPortIds = capacidades
            .filter(c => c.categoriaFuncion.id === selectedCatId)
            .map(c => c.puerto.id);
        filteredItems = filteredItems.filter(p => validPortIds.includes(p.id!));
    }

    // Luego por texto
    filteredItems = filteredItems.filter(i => 
        i.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={sectionCardStyle}>
            <h4 style={sectionTitleStyle}>{title}</h4>
            
            {/* Pills de Categorías para Puertos */}
            <div style={pillsContainerStyle}>
                <button 
                    type="button" 
                    onClick={() => setSelectedCatId(null)}
                    style={catPillStyle(selectedCatId === null)}
                >
                    Todos
                </button>
                {funciones.map(f => (
                    <button 
                        key={f.id}
                        type="button" 
                        onClick={() => setSelectedCatId(f.id!)}
                        style={catPillStyle(selectedCatId === f.id)}
                    >
                        {f.nombre}
                    </button>
                ))}
            </div>

            <input 
                type="text" 
                placeholder="Buscar puerto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={miniInputStyle}
            />
            <div style={optionsContainerStyle}>
                {filteredItems.map(item => (
                    <label key={item.id} style={optionLabelStyle}>
                        <div style={checkboxWrapperStyle(selectedIds.includes(item.id!))}>
                            {selectedIds.includes(item.id!) && <span style={checkmarkStyle}>✓</span>}
                        </div>
                        <input 
                            type="checkbox" 
                            checked={selectedIds.includes(item.id!)} 
                            onChange={() => onChange(item.id!)}
                            style={{ display: 'none' }} // Ocultamos el nativo
                        />
                        <span style={optionTextStyle(selectedIds.includes(item.id!))}>{item.nombre}</span>
                    </label>
                ))}
                {filteredItems.length === 0 && <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>No se encontraron puertos.</span>}
            </div>
        </div>
    );
};

// --- Estilos ---

const sidebarContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
    transition: 'width 0.3s ease, padding 0.3s ease',
    flexShrink: 0
};

const collapsedButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    padding: '20px 0',
    opacity: 0.7,
    transition: 'opacity 0.2s',
};

const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '6px 10px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px'
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.2rem',
    color: 'var(--text-primary)',
    fontWeight: 'bold'
};

const resetButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '6px 10px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
};

const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const labelHeaderStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: 'var(--brand-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box'
};

const sectionCardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: 'var(--input-bg)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid var(--border-color)',
    width: '100%',
    boxSizing: 'border-box'
};

const sectionTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: 'var(--brand-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const pillsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    paddingBottom: '4px'
};

const catPillStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '4px 10px',
    fontSize: '0.75rem',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: isActive ? 'var(--brand-color)' : 'rgba(255,255,255,0.05)',
    color: isActive ? '#000' : 'var(--text-primary)',
    border: `1px solid ${isActive ? 'var(--brand-color)' : 'var(--border-color)'}`,
    transition: 'all 0.2s ease'
});

const miniInputStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg-nested)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    marginBottom: '4px',
    width: '100%',
    boxSizing: 'border-box'
};

const optionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '180px',
    overflowY: 'auto',
    paddingRight: '4px',
    width: '100%'
};

const optionLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '2px 0',
    transition: 'opacity 0.2s',
};

const checkboxWrapperStyle = (isChecked: boolean): React.CSSProperties => ({
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: isChecked ? 'var(--brand-color)' : 'rgba(128, 128, 128, 0.2)', // Gris tenue
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0
});

const checkmarkStyle: React.CSSProperties = {
    color: '#000',
    fontSize: '12px',
    fontWeight: 'bold'
};

const optionTextStyle = (isSelected: boolean): React.CSSProperties => ({
    marginLeft: '10px',
    fontSize: '0.85rem',
    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontWeight: isSelected ? 'bold' : 'normal',
    transition: 'all 0.2s'
});

