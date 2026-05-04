import React from 'react';
import { HexColorPicker } from 'react-colorful';
import type { RefColor } from '../../types/Item.ts';

interface ColorPickerPaletteProps {
    selectedColors: string[];
    presets: RefColor[];
    onChange: (colors: string[]) => void;
}

export const ColorPickerPalette: React.FC<ColorPickerPaletteProps> = ({ selectedColors, presets, onChange }) => {
    const [currentColor, setCurrentColor] = React.useState("#000000");

    const handleAddColor = (hex: string) => {
        if (!selectedColors.includes(hex)) {
            onChange([...selectedColors, hex]);
        }
    };

    const handleRemoveColor = (hex: string) => {
        onChange(selectedColors.filter(c => c !== hex));
    };

    return (
        <div style={containerStyle}>
            <div style={pickerSectionStyle}>
                <HexColorPicker color={currentColor} onChange={setCurrentColor} />
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <div style={{ ...previewStyle, backgroundColor: currentColor }}></div>
                    <button 
                        type="button" 
                        onClick={() => handleAddColor(currentColor)}
                        style={addButtonStyle}
                    >
                        Agregar Color
                    </button>
                </div>
            </div>

            <div style={presetsSectionStyle}>
                <label style={labelStyle}>Colores Comunes:</label>
                <div style={gridStyle}>
                    {presets.map(p => (
                        <div 
                            key={p.id} 
                            title={p.nombre}
                            onClick={() => handleAddColor(p.codigoHex)}
                            style={{ ...presetSquareStyle, backgroundColor: p.codigoHex }}
                        ></div>
                    ))}
                </div>

                <label style={labelStyle}>Seleccionados:</label>
                <div style={selectedListStyle}>
                    {selectedColors.map(hex => (
                        <div key={hex} style={chipStyle}>
                            <div style={{ ...miniSquareStyle, backgroundColor: hex }}></div>
                            <span>{hex}</span>
                            <button type="button" onClick={() => handleRemoveColor(hex)} style={removeButtonStyle}>x</button>
                        </div>
                    ))}
                    {selectedColors.length === 0 && <span style={{ color: '#999', fontSize: '0.9rem' }}>Ninguno</span>}
                </div>
            </div>
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '30px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #eee',
    flexWrap: 'wrap'
};

const pickerSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const previewStyle: React.CSSProperties = {
    width: '100%',
    height: '30px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '10px'
};

const addButtonStyle: React.CSSProperties = {
    padding: '5px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

const presetsSectionStyle: React.CSSProperties = {
    flex: 1,
    minWidth: '200px'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
};

const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))',
    gap: '8px',
    marginBottom: '20px'
};

const presetSquareStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    transition: 'transform 0.1s'
};

const selectedListStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
};

const chipStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 8px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '0.85rem'
};

const miniSquareStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '2px'
};

const removeButtonStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    color: '#ff4d4d',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px'
};
