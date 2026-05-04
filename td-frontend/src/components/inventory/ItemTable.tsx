import React from 'react';
import type { Item } from '../../types/Item';

interface ItemTableProps {
    items: Item[];
    onDeleteItem?: (id: number) => void;
}

/**
 * Componente de Negocio: Mega Tabla de Inventario
 */
export const ItemTable: React.FC<ItemTableProps> = ({ items, onDeleteItem }) => {
    return (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={tableStyle}>
                <thead>
                    <tr style={headerRowStyle}>
                        <th>Conexiones</th>
                        <th>Tipo (Inferido)</th>
                        <th>Contenedor</th>
                        <th>Marca</th>
                        <th>Estado</th>
                        <th>Color</th>
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
                            <td style={cellStyle}>{item.color?.join(', ') || '-'}</td>
                            <td style={cellStyle}>
                                <div style={{ fontSize: '0.9em' }}>
                                    {item.especificaciones?.largo && <div>Largo: {item.especificaciones.largo}cm</div>}
                                    {item.especificaciones?.voltaje && <div>Voltaje: {item.especificaciones.voltaje}V</div>}
                                    {item.especificaciones?.modelo && <div>Mod: {item.especificaciones.modelo}</div>}
                                </div>
                            </td>
                            <td style={cellStyle}>
                                <button 
                                    onClick={() => onDeleteItem && onDeleteItem(item.id)}
                                    style={deleteButtonStyle}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Estilos temporales (luego irán a CSS) ---
const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'sans-serif',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const headerRowStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6'
};

const cellStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
    textAlign: 'left'
};

const rowStyle: React.CSSProperties = {
    transition: 'background-color 0.2s'
};

const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
};
