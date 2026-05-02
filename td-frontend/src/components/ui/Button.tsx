import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    isLoading?: boolean;
}

/**
 * Componente Atómico: Button
 * Encapsula el estilo del botón para que si queremos cambiar la estética,
 * solo lo hagamos aquí.
 */
export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    isLoading, 
    style, 
    ...props 
}) => {
    // Definimos colores base (luego podrías mover esto a un archivo CSS)
    const colors = {
        primary: { bg: '#007bff', text: '#fff' },
        secondary: { bg: '#6c757d', text: '#fff' },
        success: { bg: '#28a745', text: '#fff' },
        danger: { bg: '#dc3545', text: '#fff' },
    };

    const currentStyle = colors[variant];

    const baseStyle: React.CSSProperties = {
        padding: '10px 20px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        backgroundColor: currentStyle.bg,
        color: currentStyle.text,
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        opacity: isLoading ? 0.7 : 1,
        transition: 'background-color 0.2s',
        ...style
    };

    return (
        <button {...props} style={baseStyle} disabled={isLoading || props.disabled}>
            {isLoading ? 'Cargando...' : children}
        </button>
    );
};
