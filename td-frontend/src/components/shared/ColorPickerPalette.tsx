import React from 'react';
import type { RefColor } from '../../types/Item.ts';

interface ColorPickerPaletteProps {
    selectedColors: string[];
    presets: RefColor[];
    onChange: (colors: string[]) => void;
    onSavePreset?: (hex: string) => Promise<void>;
}

export const ColorPickerPalette: React.FC<ColorPickerPaletteProps> = ({ selectedColors, presets, onChange, onSavePreset }) => {
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
            <div style={mainRowStyle}>
                <div style={presetsSectionStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Colores Comunes:</label>
                    </div>
                    <div style={gridStyle}>
                        {presets.map(p => (
                            <div 
                                key={p.id} 
                                title={p.codigoHex}
                                onClick={() => handleAddColor(p.codigoHex)}
                                style={{ ...presetSquareStyle, backgroundColor: p.codigoHex }}
                            ></div>
                        ))}
                    </div>
                </div>

                <div style={customSectionStyle}>
                    <label style={labelStyle}>Libre:</label>
                    <div style={customControlsStyle}>
                        <input 
                            type="color" 
                            value={currentColor} 
                            onChange={(e) => setCurrentColor(e.target.value)} 
                            style={colorInputStyle} 
                        />
                        <button 
                            type="button" 
                            onClick={() => handleAddColor(currentColor)}
                            className="btn-glass"
                            style={{ padding: '0 12px', fontSize: '0.85rem' }}
                        >
                            + Agregar
                        </button>
                        {onSavePreset && (
                            <button 
                                type="button" 
                                onClick={() => onSavePreset(currentColor)}
                                className="btn-glass"
                                style={{ padding: '0 12px', fontSize: '0.85rem', color: 'var(--brand-color)' }}
                                title="Guardar como color común"
                            >
                                Guardar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={selectedSectionStyle}>
                <label style={labelStyle}>Seleccionados para este ítem:</label>
                <div style={selectedListStyle}>
                    {selectedColors.map(hex => (
                        <div key={hex} style={chipStyle}>
                            <div style={{ ...miniSquareStyle, backgroundColor: hex }}></div>
                            <span style={{ color: 'var(--text-primary)' }}>{hex}</span>
                            <button type="button" onClick={() => handleRemoveColor(hex)} style={removeButtonStyle}>×</button>
                        </div>
                    ))}
                    {selectedColors.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ninguno</span>}
                </div>
            </div>
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '16px',
    backgroundColor: 'var(--input-bg)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
};

const mainRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
};

const presetsSectionStyle: React.CSSProperties = {
    flex: 2,
    minWidth: '200px'
};

const customSectionStyle: React.CSSProperties = {
    flex: 1,
    minWidth: '150px'
};

const customControlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    height: '32px'
};

const colorInputStyle: React.CSSProperties = {
    width: '40px',
    height: '100%',
    padding: 0,
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'transparent'
};

const selectedSectionStyle: React.CSSProperties = {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '12px'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const gridStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
};

const presetSquareStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
};

const selectedListStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center'
};

const chipStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    fontSize: '0.85rem'
};

const miniSquareStyle: React.CSSProperties = {
    width: '14px',
    height: '14px',
    borderRadius: '3px',
    border: '1px solid var(--border-color)'
};

const removeButtonStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    color: 'var(--danger-color)',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px',
    fontSize: '1.1rem',
    lineHeight: 1,
    padding: '0 2px'
};


