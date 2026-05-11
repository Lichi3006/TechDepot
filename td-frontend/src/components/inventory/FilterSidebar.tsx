import React, { useEffect, useState } from 'react';
import { refService } from '../../services/refService';
import type { ItemFilterDTO } from '../../services/itemService';
import type { RefBase, RefMarca, RefEstado, RefCategoriaFuncion, RefPuerto } from '../../types/Item';

interface FilterSidebarProps {
    onFilterChange: (filters: ItemFilterDTO) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
    const [marcas, setMarcas] = useState<RefMarca[]>([]);
    const [estados, setEstados] = useState<RefEstado[]>([]);
    const [puertos, setPuertos] = useState<RefPuerto[]>([]);
    const [funciones, setFunciones] = useState<RefCategoriaFuncion[]>([]);
    const [catHw, setCatHw] = useState<RefBase[]>([]);

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
            const [m, e, p, f, h] = await Promise.all([
                refService.getMarcas(),
                refService.getEstados(),
                refService.getPuertos(),
                refService.getCategoriasFuncion(),
                refService.getCategoriasHardware()
            ]);
            setMarcas(m);
            setEstados(e);
            setPuertos(p);
            setFunciones(f);
            setCatHw(h);
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
        <div style={sidebarContainerStyle}>
            <div style={headerStyle}>
                <h3 style={titleStyle}>Filtros</h3>
                <button onClick={resetFilters} style={resetButtonStyle}>Limpiar</button>
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

            <FilterSection 
                title="Puertos" 
                items={puertos} 
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
        <div style={sectionStyle}>
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
                        <input 
                            type="checkbox" 
                            checked={selectedIds.includes(item.id!)} 
                            onChange={() => onChange(item.id!)}
                            style={checkboxStyle}
                        />
                        <span style={optionTextStyle}>{item.nombre}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// --- Estilos ---

const sidebarContainerStyle: React.CSSProperties = {
    width: '280px',
    backgroundColor: '#fff',
    borderRight: '1px solid #e0e0e0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    overflowY: 'auto',
    height: 'calc(100vh - 60px)',
    position: 'sticky',
    top: '0'
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px'
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.2rem',
    color: '#333'
};

const resetButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '4px 8px',
    borderRadius: '4px'
};

const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const labelHeaderStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase'
};

const inputStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    outline: 'none'
};

const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const sectionTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#444'
};

const miniInputStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid #eee',
    fontSize: '0.8rem',
    marginBottom: '5px'
};

const optionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '200px',
    overflowY: 'auto',
    paddingRight: '5px'
};

const optionLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '2px 0'
};

const checkboxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
};

const optionTextStyle: React.CSSProperties = {
    marginLeft: '10px',
    fontSize: '0.9rem',
    color: '#555'
};
