import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div style={layoutStyle}>
            <aside className="glass-panel" style={sidebarStyle}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src="/media/logo.svg" alt="Logo" style={{ width: '144px', filter: 'drop-shadow(0 0 10px rgba(117, 229, 97, 0.3))' }} />
                </div>
                <nav style={navStyle}>
                    <NavLink to="/" style={getLinkStyle}>Inventario</NavLink>
                    <NavLink to="/admin/nuevo" style={getLinkStyle}>Nuevo Item</NavLink>
                    <NavLink to="/admin/contenedores" style={getLinkStyle}>Gestionar Contenedores</NavLink>
                    <NavLink to="/admin/puertos" style={getLinkStyle}>Gestionar Puertos</NavLink>
                    <NavLink to="/admin/protocolos" style={getLinkStyle}>Gestionar Protocolos</NavLink>
                    <NavLink to="/admin/marcas" style={getLinkStyle}>Gestionar Marcas</NavLink>
                    <NavLink to="/admin/blindajes" style={getLinkStyle}>Gestionar Blindajes</NavLink>
                    <NavLink to="/admin/colores" style={getLinkStyle}>Gestionar Colores</NavLink>
                    <NavLink to="/admin/categorias-hardware" style={getLinkStyle}>Categorías Hardware</NavLink>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <button onClick={toggleTheme} className="btn-glass" style={{ width: '100%' }}>
                        {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                    </button>
                </div>
            </aside>
            <main style={mainStyle}>
                <Outlet />
            </main>
        </div>
    );
};

const layoutStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    padding: '24px',
    gap: '24px',
    boxSizing: 'border-box'
};

const sidebarStyle: React.CSSProperties = {
    width: '240px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
    transition: 'all 0.3s ease',
    flexShrink: 0
};

const navStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
};

const getLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    color: isActive ? 'var(--brand-color)' : 'var(--text-primary)',
    textDecoration: 'none',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? 'rgba(117, 229, 97, 0.1)' : 'transparent',
    border: isActive ? '1px solid var(--brand-color)' : '1px solid transparent',
    fontWeight: isActive ? 'bold' : 'normal',
    textShadow: isActive ? '0 0 8px rgba(117, 229, 97, 0.4)' : 'none',
});

const mainStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
};
