import React from 'react';
import type { Item } from '../../types/Item';

interface ItemTableProps {
    items: Item[];
    onDeleteItem?: (id: number) => void;
    onEditItem?: (id: number) => void;
}

/**
 * Componente de Negocio: Mega Tabla de Inventario
 */
export const ItemTable: React.FC<ItemTableProps> = ({ items, onDeleteItem, onEditItem }) => {
    return (
        <div style={{ overflowX: 'auto', fontFamily: 'sans-serif' }}>
            <table style={tableStyle}>
                <thead>
                    <tr style={headerRowStyle}>
                        <th>Conexiones</th>
                        <th>Tipo</th>
                        <th>Contenedor</th>
                        <th>Marca</th>
                        <th>Estado</th>
                        <th>Color</th>
                        <th>Proteccion</th>
                        <th>Especificaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} style={rowStyle}>
                            <td style={cellStyle}>
                                {item.conexiones?.map((con, i) => (
                                    <div key={i} style={{ marginBottom: '4px' }}>
                                        <span title={con.protocolo?.join(', ')}>
                                            {con.puerto} ({con.genero ? 'M' : 'H'})
                                        </span>
                                    </div>
                                )) || '-'}
                            </td>
                            <td style={cellStyle}>
                                <strong style={{ color: '#2e7d32' }}>{item.categoriaCalculada || 'Sin Categoría'}</strong>
                            </td>
                            <td style={cellStyle}>{item.contenedor}</td>
                            <td style={cellStyle}>{item.marca || '-'}</td>
                            <td style={cellStyle}>{item.estado}</td>
                            <td style={cellStyle}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {item.color?.map(hex => (
                                        <div 
                                            key={hex} 
                                            title={hex}
                                            style={{ 
                                                width: '20px', 
                                                height: '20px', 
                                                borderRadius: '50%', 
                                                backgroundColor: hex,
                                                border: '1px solid #ddd'
                                            }}
                                        ></div>
                                    )) || '-'}
                                </div>
                            </td>
                            <td style={cellStyle}>
                                <div style={{ fontSize: '0.85rem' }}>
                                    {item.proteccion?.blindajeExterno && <div>Ext: {item.proteccion.blindajeExterno}</div>}
                                    {item.proteccion?.blindajeInterno && <div>Int: {item.proteccion.blindajeInterno}</div>}
                                    {!item.proteccion?.blindajeExterno && !item.proteccion?.blindajeInterno && '-'}
                                </div>
                            </td>
                            <td style={cellStyle}>
                                <div style={{ fontSize: '0.9em' }}>
                                    {item.especificaciones?.largo && <div>Largo: {item.especificaciones.largo}cm</div>}
                                    {item.especificaciones?.voltaje && <div>Voltaje: {item.especificaciones.voltaje}V</div>}
                                    {item.especificaciones?.amperaje && <div>Amperaje: {item.especificaciones.amperaje}A</div>}
                                    {item.especificaciones?.amperajeMax && <div>Amp. Max: {item.especificaciones.amperajeMax}A</div>}
                                    {item.especificaciones?.modelo && <div>Mod: {item.especificaciones.modelo}</div>}
                                </div>
                            </td>
                            <td style={cellStyle}>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button 
                                        onClick={() => onEditItem?.(item.id)}
                                        style={editButtonStyle}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => onDeleteItem?.(item.id)}
                                        style={deleteButtonStyle}
                                    >
                                        Eliminar
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
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px'
};

const headerRowStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left'
};

const rowStyle: React.CSSProperties = {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s'
};

const cellStyle: React.CSSProperties = {
    padding: '12px 15px',
    verticalAlign: 'top'
};

const editButtonStyle: React.CSSProperties = {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
};

const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
};
