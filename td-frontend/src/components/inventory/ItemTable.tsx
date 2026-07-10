import React from 'react';
import type { Item } from '../../types/Item';
import './ItemTable.css';

interface ItemTableProps {
    items: Item[];
    onDeleteItem?: (id: number) => void;
    onEditItem?: (id: number) => void;
}

const IconWrapper: React.FC<{ children: React.ReactNode, tooltip?: string, className?: string }> = ({ children, tooltip, className }) => (
    <span 
        className={`has-tooltip ${className || ''}`}
        data-tooltip={tooltip}
        style={{
            fontSize: '1.2rem',
            padding: '4px',
            background: 'var(--surface-color)',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            cursor: 'help',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px'
        }}
    >
        {children}
    </span>
);

const MiniIconWrapper: React.FC<{ children: React.ReactNode, tooltip?: string }> = ({ children, tooltip }) => (
    <span 
        className="has-tooltip"
        data-tooltip={tooltip}
        style={{
            fontSize: '1rem',
            padding: '2px',
            background: 'var(--surface-color)',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            cursor: 'help',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px'
        }}
    >
        {children}
    </span>
);

// --- SVGs Definitions ---
const SvgBolt = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="100%" height="100%"><path d="M14.615 1.595a.75.75 0 0 1 .359.852L12.972 9.75h7.278a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262L13.702 1.77a.75.75 0 0 1 .913-.175Z" /></svg>;
const SvgTag = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const SvgTv = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>;
const SvgMusic = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;
const SvgGlobe = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const SvgPlug = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M12 2v6"></path><path d="M12 18v4"></path><path d="M9 8h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"></path><path d="M10 2v2"></path><path d="M14 2v2"></path></svg>;
const SvgLaptop = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>;
const SvgLink = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const SvgHeadphones = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>;
const SvgVga = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><circle cx="8" cy="12" r="1"></circle><circle cx="16" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle></svg>;
const SvgBox = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;

const AttributePill: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        fontSize: '0.75rem', 
        backgroundColor: 'var(--surface-color)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '6px', 
        overflow: 'hidden',
        marginRight: '6px',
        marginBottom: '6px'
    }}>
        <span style={{ padding: '3px 6px', backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ padding: '3px 6px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{value}</span>
    </div>
);

const getCategoryDetails = (categoryStr?: string) => {
    if (!categoryStr) return [{ name: 'Sin Categoría', icon: <SvgTag /> }];
    
    const cats = categoryStr.split(/[\+,]/).map(c => c.trim()).filter(Boolean);
    if (cats.length === 0) return [{ name: 'Sin Categoría', icon: <SvgTag /> }];
    
    return cats.map(cat => {
        const lower = cat.toLowerCase();
        let icon: React.ReactNode = <SvgTag />;
        if (lower.includes('video')) icon = <SvgTv />;
        else if (lower.includes('energ') || lower.includes('alimentación') || lower.includes('fuente')) icon = <SvgBolt />;
        else if (lower.includes('audio')) icon = <SvgMusic />;
        else if (lower.includes('red') || lower.includes('internet')) icon = <SvgGlobe />;
        else if (lower.includes('datos') || lower.includes('usb')) icon = <SvgPlug />;
        else if (lower.includes('hardware') || lower.includes('componente')) icon = <SvgLaptop />;
        return { name: cat, icon };
    });
};

const getProtocolIcon = (protocol?: string): React.ReactNode => {
    if (!protocol) return <SvgLink />;
    const lower = protocol.toLowerCase();
    if (lower.includes('hdmi')) return <SvgTv />;
    if (lower.includes('usb')) return <SvgPlug />;
    if (lower.includes('displayport') || lower.includes('dp')) return <SvgTv />;
    if (lower.includes('vga')) return <SvgVga />;
    if (lower.includes('audio') || lower.includes('jack') || lower.includes('plug')) return <SvgHeadphones />;
    if (lower.includes('ethernet') || lower.includes('rj45')) return <SvgGlobe />;
    if (lower.includes('power') || lower.includes('ac') || lower.includes('dc')) return <SvgBolt />;
    return <SvgLink />;
};

export const ItemTable: React.FC<ItemTableProps> = ({ items, onDeleteItem, onEditItem }) => {
    return (
        <div className="table-container">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Conexiones</th>
                        <th>Tipo</th>
                        <th>Ubicación</th>
                        <th>Marca</th>
                        <th>Estado</th>
                        <th>Color</th>
                        <th>Protección</th>
                        <th>Especificaciones</th>
                        {(onEditItem || onDeleteItem) && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <React.Fragment key={item.id}>
                            {/* ================= DESKTOP ROW ================= */}
                            <tr className="desktop-row">
                            <td data-label="Conexiones">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {item.conexiones?.map((con, i) => (
                                        <React.Fragment key={i}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                                    {con.puerto} <span style={{color: 'var(--text-secondary)'}}>({con.genero ? 'M' : 'H'})</span>
                                                </span>
                                                {con.protocolo && con.protocolo.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        {con.protocolo.map((prot, pIdx) => (
                                                            <MiniIconWrapper key={pIdx} tooltip={`Protocolo: ${prot}`}>
                                                                {getProtocolIcon(prot)}
                                                            </MiniIconWrapper>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {i < (item.conexiones?.length || 0) - 1 && (
                                                <span className="mobile-only" style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>→</span>
                                            )}
                                        </React.Fragment>
                                    )) || '-'}
                                </div>
                            </td>
                            
                            <td data-label="Tipo" style={{ textAlign: 'center' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '4px', justifyContent: 'center' }}>
                                    {getCategoryDetails(item.categoriaCalculada).map((cat, idx) => (
                                        <IconWrapper key={idx} tooltip={cat.name} className="text-neon">
                                            {cat.icon}
                                        </IconWrapper>
                                    ))}
                                </div>
                            </td>

                            <td data-label="Contenedor">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-color)', fontWeight: 'bold' }}>
                                    <SvgBox />
                                    <span>{item.contenedor || 'Sin asignar'}</span>
                                </div>
                            </td>

                            <td data-label="Marca">
                                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.marca || '-'}</span>
                            </td>

                            <td data-label="Estado">
                                <span style={{ color: 'var(--text-primary)' }}>{item.estado || '-'}</span>
                            </td>

                            <td data-label="Color" style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {item.color?.map(hex => (
                                        <div 
                                            key={hex} 
                                            className="has-tooltip"
                                            data-tooltip={`Color: ${hex}`}
                                            style={{ 
                                                width: '20px', 
                                                height: '20px', 
                                                borderRadius: '4px', 
                                                backgroundColor: hex,
                                                border: '1px solid var(--border-color)'
                                            }}
                                        ></div>
                                    )) || '-'}
                                </div>
                            </td>

                            <td data-label="Protección">
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {item.proteccion?.blindajeExterno && <AttributePill label="Ext" value={item.proteccion.blindajeExterno} />}
                                    {item.proteccion?.blindajeInterno && <AttributePill label="Int" value={item.proteccion.blindajeInterno} />}
                                    {!item.proteccion?.blindajeExterno && !item.proteccion?.blindajeInterno && <span style={{color: 'var(--text-secondary)'}}>-</span>}
                                </div>
                            </td>

                            <td data-label="Especs.">
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {item.especificaciones?.largo && <AttributePill label="Largo" value={`${item.especificaciones.largo}cm`} />}
                                    {item.especificaciones?.voltaje && <AttributePill label="Voltaje" value={`${item.especificaciones.voltaje}V`} />}
                                    {item.especificaciones?.amperaje && <AttributePill label="Amperaje" value={`${item.especificaciones.amperaje}A`} />}
                                    {item.especificaciones?.amperajeMax && <AttributePill label="Amp. Max" value={`${item.especificaciones.amperajeMax}A`} />}
                                    {item.especificaciones?.modelo && <AttributePill label="Mod" value={item.especificaciones.modelo} />}
                                    {!item.especificaciones?.largo && !item.especificaciones?.voltaje && !item.especificaciones?.amperaje && !item.especificaciones?.modelo && <span style={{color: 'var(--text-secondary)'}}>-</span>}
                                </div>
                            </td>

                            {(onEditItem || onDeleteItem) && (
                                <td data-label="Acciones">
                                    <div className="action-buttons">
                                        {onEditItem && (
                                            <button 
                                                onClick={() => onEditItem(item.id)}
                                                className="btn-glass"
                                                style={{ color: 'var(--brand-color)', borderColor: 'rgba(117, 229, 97, 0.4)', padding: '6px 10px', display: 'flex', alignItems: 'center' }}
                                                title="Editar"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                        )}
                                        {onDeleteItem && (
                                            <button 
                                                type="button"
                                                onClick={() => onDeleteItem(item.id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}
                                                title="Eliminar"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>

                            {/* ================= MOBILE ROW ================= */}
                            <tr className="mobile-row">
                                <td colSpan={9} style={{ padding: 0, border: 'none' }}>
                                    <div className="mobile-card">
                                        {/* SECTION 1: PUERTOS Y TIPO */}
                                        <div className="mc-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {item.conexiones?.map((con, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                                                            {con.puerto} <span style={{color: 'var(--text-secondary)'}}>({con.genero ? 'M' : 'H'})</span>
                                                        </span>
                                                        {con.protocolo && con.protocolo.length > 0 && (
                                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                                {con.protocolo.map((prot, pIdx) => (
                                                                    <MiniIconWrapper key={pIdx} tooltip={`Protocolo: ${prot}`}>
                                                                        {getProtocolIcon(prot)}
                                                                    </MiniIconWrapper>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )) || <span style={{ color: 'var(--text-secondary)' }}>Sin conexiones</span>}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '4px' }}>
                                                {getCategoryDetails(item.categoriaCalculada).map((cat, idx) => (
                                                    <IconWrapper key={idx} tooltip={cat.name} className="text-neon">
                                                        {cat.icon}
                                                    </IconWrapper>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mc-divider" />

                                        {/* SECTION 2: CONTENEDOR */}
                                        <div className="mc-section">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-color)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                <SvgBox />
                                                <span>{item.contenedor || 'Sin asignar'}</span>
                                            </div>
                                        </div>

                                        <div className="mc-divider" />

                                        {/* SECTION 3: CARACTERISTICAS (Pills) */}
                                        <div className="mc-section" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {item.marca && <AttributePill label="Marca" value={item.marca} />}
                                            {item.estado && <AttributePill label="Estado" value={item.estado} />}
                                            
                                            {item.color?.map(hex => (
                                                <div key={hex} style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', marginRight: '6px', marginBottom: '6px' }}>
                                                    <span style={{ padding: '3px 6px', backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Color</span>
                                                    <span style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: hex, border: '1px solid var(--border-color)' }} />
                                                    </span>
                                                </div>
                                            ))}

                                            {item.proteccion?.blindajeExterno && <AttributePill label="Ext" value={item.proteccion.blindajeExterno} />}
                                            {item.proteccion?.blindajeInterno && <AttributePill label="Int" value={item.proteccion.blindajeInterno} />}
                                            {item.especificaciones?.largo && <AttributePill label="Largo" value={`${item.especificaciones.largo}cm`} />}
                                            {item.especificaciones?.voltaje && <AttributePill label="Voltaje" value={`${item.especificaciones.voltaje}V`} />}
                                            {item.especificaciones?.amperaje && <AttributePill label="Amperaje" value={`${item.especificaciones.amperaje}A`} />}
                                            {item.especificaciones?.amperajeMax && <AttributePill label="Amp. Max" value={`${item.especificaciones.amperajeMax}A`} />}
                                            {item.especificaciones?.modelo && <AttributePill label="Mod" value={item.especificaciones.modelo} />}
                                        </div>

                                        {/* ACCIONES */}
                                        {(onEditItem || onDeleteItem) && (
                                            <div className="mc-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                {onEditItem && (
                                                    <button onClick={() => onEditItem(item.id)} className="btn-glass" style={{ color: 'var(--brand-color)', borderColor: 'rgba(117, 229, 97, 0.4)', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                )}
                                                {onDeleteItem && (
                                                    <button type="button" onClick={() => onDeleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
