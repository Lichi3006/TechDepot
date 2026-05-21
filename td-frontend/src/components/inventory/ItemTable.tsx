import React from 'react';
import type { Item } from '../../types/Item';

interface ItemTableProps {
    items: Item[];
    onDeleteItem?: (id: number) => void;
    onEditItem?: (id: number) => void;
}

const BoltIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        style={{ width: '1em', height: '1em', display: 'inline-block' }}
    >
        <path 
            fillRule="evenodd" 
            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.972 9.75h7.278a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262L13.702 1.77a.75.75 0 0 1 .913-.175Z" 
            clipRule="evenodd" 
        />
    </svg>
);

const getCategoryDetails = (categoryStr?: string) => {
    if (!categoryStr) return [{ name: 'Sin Categoría', icon: '🏷️' }];
    
    // Split combined categories like "Video + Energía" or "Video, Energía"
    const cats = categoryStr.split(/[\+,]/).map(c => c.trim()).filter(Boolean);
    if (cats.length === 0) return [{ name: 'Sin Categoría', icon: '🏷️' }];
    
    return cats.map(cat => {
        const lower = cat.toLowerCase();
        let icon: React.ReactNode = '🏷️';
        if (lower.includes('video')) icon = '📺';
        else if (lower.includes('energ') || lower.includes('alimentación') || lower.includes('fuente')) icon = <BoltIcon />;
        else if (lower.includes('audio')) icon = '🎵';
        else if (lower.includes('red') || lower.includes('internet')) icon = '🌐';
        else if (lower.includes('datos') || lower.includes('usb')) icon = '🔌';
        else if (lower.includes('hardware') || lower.includes('componente')) icon = '💻';
        return { name: cat, icon };
    });
};

const getProtocolIcon = (protocol?: string): React.ReactNode => {
    if (!protocol) return '🔗';
    const lower = protocol.toLowerCase();
    if (lower.includes('hdmi')) return '📺';
    if (lower.includes('usb')) return '🔌';
    if (lower.includes('displayport') || lower.includes('dp')) return '🖥️';
    if (lower.includes('vga')) return '📼';
    if (lower.includes('audio') || lower.includes('jack') || lower.includes('plug')) return '🎧';
    if (lower.includes('ethernet') || lower.includes('rj45')) return '🌐';
    if (lower.includes('power') || lower.includes('ac') || lower.includes('dc')) return <BoltIcon />;
    return '🔗';
};

/**
 * Componente de Negocio: Mega Tabla de Inventario (Dark Glass Theme)
 */
export const ItemTable: React.FC<ItemTableProps> = ({ items, onDeleteItem, onEditItem }) => {
    return (
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={tableStyle}>
                <thead>
                    <tr style={headerRowStyle}>
                        <th style={headerCellStyle}>Conexiones</th>
                        <th style={headerCellStyle}>Tipo</th>
                        <th style={headerCellStyle}>Ubicación</th>
                        <th style={headerCellStyle}>Marca</th>
                        <th style={headerCellStyle}>Estado</th>
                        <th style={headerCellStyle}>Color</th>
                        <th style={headerCellStyle}>Protección</th>
                        <th style={headerCellStyle}>Especificaciones</th>
                        <th style={headerCellStyle}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id} style={getRowStyle(index)}>
                            {/* Conexiones (Puerto como texto, Protocolos como iconos) */}
                            <td style={cellStyle}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                    {item.conexiones?.map((con, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                                {con.puerto} <span style={{color: 'var(--text-secondary)'}}>({con.genero ? 'M' : 'H'})</span>
                                            </span>
                                            {con.protocolo && con.protocolo.length > 0 && (
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    {con.protocolo.map((prot, pIdx) => (
                                                        <span 
                                                            key={pIdx}
                                                            className="has-tooltip"
                                                            data-tooltip={`Protocolo: ${prot}`}
                                                            style={miniIconWrapperStyle}
                                                        >
                                                            {getProtocolIcon(prot)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )) || '-'}
                                </div>
                            </td>
                            
                            {/* Tipo (Múltiples Iconos separados por Función en Grid de max 2 columnas) */}
                            <td style={{...cellStyle, textAlign: 'center'}}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '4px', justifyContent: 'center' }}>
                                    {getCategoryDetails(item.categoriaCalculada).map((cat, idx) => (
                                        <span 
                                            key={idx}
                                            className="has-tooltip" 
                                            data-tooltip={cat.name}
                                            style={{...iconWrapperStyle, color: 'var(--brand-color)'}}
                                        >
                                            {cat.icon}
                                        </span>
                                    ))}
                                </div>
                            </td>

                            {/* Contenedor (Texto plano) */}
                            <td style={cellStyle}>
                                <span style={{ color: 'var(--text-primary)' }}>{item.contenedor || '-'}</span>
                            </td>

                            {/* Marca (Sigue siendo texto) */}
                            <td style={cellStyle}>
                                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.marca || '-'}</span>
                            </td>

                            {/* Estado (Texto plano) */}
                            <td style={cellStyle}>
                                <span style={{ color: 'var(--text-primary)' }}>{item.estado || '-'}</span>
                            </td>

                            {/* Color (Squares) */}
                            <td style={{...cellStyle, textAlign: 'center'}}>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {item.color?.map(hex => (
                                        <div 
                                            key={hex} 
                                            className="has-tooltip"
                                            data-tooltip={`Color: ${hex}`}
                                            style={{ 
                                                width: '20px', 
                                                height: '20px', 
                                                borderRadius: '4px', 
                                                backgroundColor: hex,
                                                border: '1px solid var(--border-color)'
                                            }}
                                        ></div>
                                    )) || '-'}
                                </div>
                            </td>

                            {/* Proteccion (Texto compacto) */}
                            <td style={cellStyle}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {item.proteccion?.blindajeExterno && <div>Ext: <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{item.proteccion.blindajeExterno}</span></div>}
                                    {item.proteccion?.blindajeInterno && <div>Int: <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{item.proteccion.blindajeInterno}</span></div>}
                                    {!item.proteccion?.blindajeExterno && !item.proteccion?.blindajeInterno && <span style={{color: 'var(--text-secondary)'}}>-</span>}
                                </div>
                            </td>

                            {/* Especificaciones (Texto compacto) */}
                            <td style={cellStyle}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {item.especificaciones?.largo && <div>Largo: <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{item.especificaciones.largo}cm</span></div>}
                                    {item.especificaciones?.voltaje && <div>Voltaje: <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{item.especificaciones.voltaje}V</span></div>}
                                    {item.especificaciones?.amperaje && <div>Amperaje: <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{item.especificaciones.amperaje}A</span></div>}
                                    {item.especificaciones?.amperajeMax && <div>Amp. Max: <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{item.especificaciones.amperajeMax}A</span></div>}
                                    {item.especificaciones?.modelo && <div>Mod: <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{item.especificaciones.modelo}</span></div>}
                                </div>
                            </td>

                            {/* Acciones */}
                            <td style={{...cellStyle, textAlign: 'center'}}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button 
                                        onClick={() => onEditItem?.(item.id)}
                                        className="btn-glass"
                                        style={{ color: 'var(--brand-color)', borderColor: 'rgba(117, 229, 97, 0.4)', padding: '6px 10px' }}
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => onDeleteItem?.(item.id)}
                                        className="btn-danger"
                                        style={{ padding: '6px 10px' }}
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
    backgroundColor: 'var(--input-bg)'
};

const headerRowStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface-hover)',
    borderBottom: '1px solid var(--border-color)',
};

const headerCellStyle: React.CSSProperties = {
    padding: '12px 10px',
    color: 'var(--brand-color)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    textAlign: 'center',
    border: '1px solid var(--border-color)'
};

const getRowStyle = (index: number): React.CSSProperties => ({
    backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--surface-color)',
    transition: 'background-color 0.2s',
});

const cellStyle: React.CSSProperties = {
    padding: '12px 10px',
    verticalAlign: 'middle',
    fontSize: '0.85rem',
    textAlign: 'left',
    border: '1px solid var(--border-color)'
};

const iconWrapperStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    padding: '2px 4px',
    background: 'var(--surface-color)',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    cursor: 'help',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const miniIconWrapperStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    padding: '2px',
    background: 'var(--surface-color)',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    cursor: 'help',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
};
