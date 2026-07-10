import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface PromptModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    defaultValue?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, title, message, defaultValue = '', onConfirm, onCancel }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--brand-color)' }}>{title}</h3>
                <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)' }}>{message}</p>
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={inputStyle}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onConfirm(value);
                        if (e.key === 'Escape') onCancel();
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button variant="success" onClick={() => onConfirm(value)}>Aceptar</Button>
                </div>
            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
};

const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface-color)',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    marginBottom: '20px',
    boxSizing: 'border-box'
};
