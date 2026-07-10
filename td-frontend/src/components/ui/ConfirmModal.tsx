import React from 'react';
import { Button } from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--brand-color)' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
                </div>
            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)'
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
