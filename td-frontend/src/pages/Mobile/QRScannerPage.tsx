import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { refService } from '../../services/refService';
import { itemService } from '../../services/itemService';
import type { Contenedor, Item } from '../../types/Item';
import { Button } from '../../components/ui/Button';
import { ItemTable } from '../../components/inventory/ItemTable';

export default function QRScannerPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [container, setContainer] = useState<Contenedor | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        // Initialize scanner only once
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader", 
                { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true }, 
                /* verbose= */ false
            );
            
            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e));
                scannerRef.current = null;
            }
        };
    }, []);

    const onScanSuccess = async (decodedText: string) => {
        // Prevent multiple triggers from the continuous stream
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        // Stop scanning after successful read
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
        }
        
        setScanResult(decodedText);
        setError(null);
        setLoading(true);

        try {
            // 1. Fetch all containers to find the match by UUID
            const contenedores = await refService.getContenedores();
            const matchedContainer = contenedores.find(c => c.QrUUID === decodedText);

            if (!matchedContainer) {
                setError(`Contenedor no encontrado en la base de datos (UUID: ${decodedText})`);
                setLoading(false);
                return;
            }

            setContainer(matchedContainer);

            // 2. Fetch items inside this container
            const itemsInContainer = await itemService.search({ idsContenedores: [matchedContainer.id!] });
            setItems(itemsInContainer);

        } catch (err) {
            console.error(err);
            setError("Error de conexión al servidor al buscar el contenedor.");
        } finally {
            setLoading(false);
        }
    };

    const onScanFailure = () => {
        // html5-qrcode triggers this constantly while it doesn't see a QR, so we usually ignore it
    };

    const resetScanner = () => {
        isProcessingRef.current = false;
        setScanResult(null);
        setContainer(null);
        setItems([]);
        setError(null);
        
        scannerRef.current = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true }, 
            false
        );
        scannerRef.current.render(onScanSuccess, onScanFailure);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <header className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                <h1 style={{ margin: 0, color: 'var(--brand-color)' }}>Escaner QR</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Escanea un contenedor para ver su interior</p>
            </header>

            {!scanResult && (
                <div className="glass-panel" style={{ padding: '20px', backgroundColor: '#000' }}>
                    <div id="reader" style={{ width: '100%' }}></div>
                </div>
            )}

            {loading && <p style={{ textAlign: 'center', color: 'var(--brand-color)' }}>Buscando base de datos...</p>}

            {error && (
                <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--danger-color)', backgroundColor: 'var(--surface-color)' }}>
                    <h3 style={{ color: 'var(--danger-color)', marginTop: 0 }}>Error</h3>
                    <p style={{ color: 'var(--text-primary)' }}>{error}</p>
                    <Button variant="secondary" onClick={resetScanner} style={{ width: '100%', marginTop: '16px' }}>Intentar de nuevo</Button>
                </div>
            )}

            {container && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h2 style={{ color: 'var(--brand-color)', marginTop: 0 }}>{container.nombre}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Tipo: {container.tipoContenedor?.nombre} ({container.tipoContenedor?.prefijo})</p>
                    
                    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--text-primary)' }}>
                        Contenido ({items.length} ítems)
                    </h3>
                    
                    {items.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>El contenedor está vacío.</p>
                    ) : (
                        <ItemTable items={items} />
                    )}

                    <Button variant="primary" onClick={resetScanner} style={{ width: '100%', marginTop: '24px' }}>Escanear otro contenedor</Button>
                </div>
            )}
            
            <style>{`
                /* Estilos para limpiar la horrenda UI por defecto de html5-qrcode */
                #reader {
                    border: none !important;
                    border-radius: 12px;
                    overflow: hidden;
                }
                #reader button {
                    background: var(--surface-color);
                    color: var(--brand-color);
                    border: 1px solid var(--border-color);
                    padding: 8px 16px;
                    border-radius: 6px;
                    margin: 8px;
                    cursor: pointer;
                    font-family: inherit;
                    font-weight: bold;
                }
                #reader a {
                    color: var(--brand-color) !important;
                }
                #reader select {
                    background: var(--input-bg);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    padding: 6px;
                    border-radius: 6px;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
}
