import { NavLink } from 'react-router-dom';

export default function MobileSettingsPage() {
    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1 style={{ color: 'var(--brand-color)', marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Ajustes y Administración</h1>
            
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <NavLink to="/admin/contenedores" className="btn-glass" style={{ textAlign: 'left', textDecoration: 'none' }}>Gestionar Contenedores</NavLink>
                <NavLink to="/admin/puertos" className="btn-glass" style={{ textAlign: 'left', textDecoration: 'none' }}>Gestionar Puertos</NavLink>
                <NavLink to="/admin/protocolos" className="btn-glass" style={{ textAlign: 'left', textDecoration: 'none' }}>Gestionar Protocolos</NavLink>
                <NavLink to="/admin/marcas" className="btn-glass" style={{ textAlign: 'left', textDecoration: 'none' }}>Gestionar Marcas</NavLink>
                <NavLink to="/admin/blindajes" className="btn-glass" style={{ textAlign: 'left', textDecoration: 'none' }}>Gestionar Blindajes</NavLink>
                <NavLink to="/admin/colores" className="btn-glass" style={{ textAlign: 'left', textDecoration: 'none' }}>Gestionar Colores</NavLink>
                <NavLink to="/admin/categorias-hardware" className="btn-glass" style={{ textAlign: 'left', textDecoration: 'none' }}>Categorías Hardware</NavLink>
            </div>
        </div>
    );
}
