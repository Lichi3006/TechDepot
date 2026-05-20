import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    isLoading?: boolean;
}

/**
 * Componente Atómico: Button
 * Reutiliza las clases globales definidas en index.css
 */
export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    isLoading, 
    style, 
    className,
    ...props 
}) => {
    let btnClass = 'btn-primary';
    if (variant === 'secondary') btnClass = 'btn-glass';
    if (variant === 'danger') btnClass = 'btn-danger';
    // 'success' también mapea a 'btn-primary' porque nuestro color de marca es verde
    if (variant === 'success') btnClass = 'btn-primary';

    return (
        <button 
            {...props} 
            className={`${btnClass} ${className || ''}`}
            style={{ ...style, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : undefined }} 
            disabled={isLoading || props.disabled}
        >
            {isLoading ? 'Cargando...' : children}
        </button>
    );
};
