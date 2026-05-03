import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
    return (
        <div style={layoutStyle}>
            <aside style={sidebarStyle}>
                <h2 style={titleStyle}>TechDepot</h2>
                <nav style={navStyle}>
                    <Link to="/" style={linkStyle}>Inventario</Link>
                    <Link to="/admin/nuevo" style={linkStyle}>Nuevo Item</Link>
                    <Link to="/admin/contenedores/nuevo" style={linkStyle}>Nuevo Contenedor</Link>
                    <Link to="/admin/parametros" style={linkStyle}>Parametros</Link>
                </nav>
            </aside>
            <main style={mainStyle}>
                <Outlet />
            </main>
        </div>
    );
};

const layoutStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
};

const sidebarStyle: React.CSSProperties = {
    width: '250px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
};

const titleStyle: React.CSSProperties = {
    margin: '0 0 30px 0',
    fontSize: '1.5rem',
    color: '#4CAF50'
};

const navStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const linkStyle: React.CSSProperties = {
    color: '#ccc',
    textDecoration: 'none',
    padding: '10px',
    borderRadius: '4px',
    transition: 'background 0.2s',
};

const mainStyle: React.CSSProperties = {
    flex: 1,
    padding: '30px',
    overflowY: 'auto'
};
