import React, { useEffect, useState } from 'react';
import { refService } from '../../services/refService';
import type { ItemFilterDTO } from '../../services/itemService';
import type { RefBase, RefMarca, RefEstado, RefCategoriaFuncion, RefPuerto } from '../../types/Item';

interface FilterBarProps {
    onFilterChange: (filters: ItemFilterDTO) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
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

    const handleCheckboxChange = (category: keyof ItemFilterDTO, id: number) => {
        const currentIds = (selectedFilters[category] as number[]) || [];
        const newIds = currentIds.includes(id)
            ? currentIds.filter(item => item !== id)
            : [...currentIds, id];
        
        const newFilters = { ...selectedFilters, [category]: newIds };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilters = { ...selectedFilters, query: e.target.value };
        setSelectedFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const emptyFilters = {
            idsMarcas: [],
            idsEstados: [],
            idsPuertos: [],
            idsCategoriasFuncion: [],
            idsCategoriasHardware: [],
            query: ''
        };
        setSelectedFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    return (
        <div style={containerStyle}>
            <div style={sectionStyle}>
                <input 
                    type="text" 
                    placeholder="Buscar por modelo o marca..." 
                    value={selectedFilters.query}
                    onChange={handleQueryChange}
                    style={inputStyle}
                />
            </div>

            <div style={filtersGridStyle}>
                <FilterGroup 
                    title="Marcas" 
                    items={marcas} 
                    selectedIds={selectedFilters.idsMarcas || []} 
                    onChange={(id) => handleCheckboxChange('idsMarcas', id)} 
                />
                <FilterGroup 
                    title="Estados" 
                    items={estados} 
                    selectedIds={selectedFilters.idsEstados || []} 
                    onChange={(id) => handleCheckboxChange('idsEstados', id)} 
                />
                <FilterGroup 
                    title="Puertos" 
                    items={puertos} 
                    selectedIds={selectedFilters.idsPuertos || []} 
                    onChange={(id) => handleCheckboxChange('idsPuertos', id)} 
                />
                <FilterGroup 
                    title="Funciones" 
                    items={funciones} 
                    selectedIds={selectedFilters.idsCategoriasFuncion || []} 
                    onChange={(id) => handleCheckboxChange('idsCategoriasFuncion', id)} 
                />
                <FilterGroup 
                    title="Hardware" 
                    items={catHw} 
                    selectedIds={selectedFilters.idsCategoriasHardware || []} 
                    onChange={(id) => handleCheckboxChange('idsCategoriasHardware', id)} 
                />
            </div>

            <button onClick={resetFilters} style={resetButtonStyle}>
                Limpiar Filtros
            </button>
        </div>
    );
};

const FilterGroup: React.FC<{ 
    title: string, 
    items: RefBase[], 
    selectedIds: number[], 
    onChange: (id: number) => void 
}> = ({ title, items, selectedIds, onChange }) => (
    <div style={groupStyle}>
        <h4 style={groupTitleStyle}>{title}</h4>
        <div style={scrollAreaStyle}>
            {items.map(item => (
                <label key={item.id} style={labelStyle}>
                    <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id!)} 
                        onChange={() => onChange(item.id!)}
                    />
                    <span style={{ marginLeft: '8px' }}>{item.nombre}</span>
                </label>
            ))}
        </div>
    </div>
);

const containerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px',
    border: '1px solid #eee'
};

const sectionStyle: React.CSSProperties = {
    marginBottom: '20px'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem'
};

const filtersGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
};

const groupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

const groupTitleStyle: React.CSSProperties = {
    margin: '0 0 10px 0',
    fontSize: '0.9rem',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const scrollAreaStyle: React.CSSProperties = {
    maxHeight: '150px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#333'
};

const resetButtonStyle: React.CSSProperties = {
    backgroundColor: '#f1f3f5',
    color: '#495057',
    border: '1px solid #dee2e6',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
};
