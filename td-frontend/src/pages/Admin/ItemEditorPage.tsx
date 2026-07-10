import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ItemCreateDTO, RefCategoriaFuncion } from '../../types/Item.ts';
import { itemService } from '../../services/itemService.ts';
import { ItemForm } from '../../components/inventory/ItemForm.tsx';
import { refService } from '../../services/refService.ts';

export default function ItemEditorPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [initialData, setInitialData] = useState<ItemCreateDTO | undefined>(undefined);
    const [initialType, setInitialType] = useState<'CABLE' | 'FUENTE' | 'HARDWARE' | 'OTRO' | undefined>(undefined);
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            const loadItem = async () => {
                try {
                    // El backend nos devuelve el ItemDTO completo (vista resuelta)
                    // Para el formulario necesitamos convertirlo de vuelta a un DTO de creación
                    // que usa IDs en lugar de nombres.
                    const allItems = await itemService.getAll();
                    const item = allItems.find(i => i.id === Number(id));

                    if (item) {
                        // Mapeo manual de ItemDTO a ItemCreateDTO
                        const marcas = await refService.getMarcas();
                        const estados = await refService.getEstados();
                        const contenedores = await refService.getContenedores();
                        const puertos = await refService.getPuertos();
                        const funciones = await refService.getCategoriasFuncion();
                        const protocolos = await refService.getProtocolos();
                        const blindajesExt = await refService.getBlindajesExternos();
                        const blindajesInt = await refService.getBlindajesInternos();

                        const dto: ItemCreateDTO = {
                            idEstado: estados.find(e => e.nombre === item.estado)?.id || 0,
                            idMarca: marcas.find(m => m.nombre === item.marca)?.id,
                            idContenedor: contenedores.find(c => c.nombre === item.contenedor)?.id || 0,
                            coloresHex: item.color,
                            conexiones: item.conexiones.flatMap((con, extIdx) => {
                                const idPuerto = puertos.find(p => p.nombre === con.puerto)?.id || 0;
                                // Nota: Como el backend colapsa funciones por puerto en el DTO de salida,
                                // pero nosotros queremos recuperar la estructura multifunción, 
                                // aquí hay una simplificación. En un sistema real, el backend 
                                // debería proveer un endpoint GET /api/items/{id}/edit con el DTO exacto.
                                return con.protocolo.length > 0 ? con.protocolo.map(pName => {
                                    const protObj = protocolos.find(p => p.nombre === pName && p.puerto.nombre === con.puerto);
                                    return {
                                        idExtremo: extIdx,
                                        idPuerto,
                                        idCategoriaFuncion: protObj?.categoriaFuncion.id || 0,
                                        genero: con.genero,
                                        idsProtocolos: [protObj?.id || 0]
                                    };
                                }) : [{
                                    idExtremo: extIdx,
                                    idPuerto,
                                    idCategoriaFuncion: funciones.find((f: RefCategoriaFuncion) => item.categoriaCalculada.includes(f.nombre))?.id || 0,
                                    genero: con.genero,
                                    idsProtocolos: []
                                }];
                            }),
                            detalleCable: item.especificaciones.largo ? {
                                largo: item.especificaciones.largo,
                                idBlindajeExterno: blindajesExt.find(b => b.nombre === item.proteccion?.blindajeExterno)?.id || 1,
                                idBlindajeInterno: blindajesInt.find(b => b.nombre === item.proteccion?.blindajeInterno)?.id,
                                amperajeMax: item.especificaciones.amperajeMax
                            } : undefined,
                            detalleFuente: item.especificaciones.voltaje ? {
                                voltaje: item.especificaciones.voltaje as any,
                                amperaje: item.especificaciones.amperaje as any
                            } : undefined,
                            detalleHardware: item.especificaciones.modelo ? {
                                modeloAlfanumerico: item.especificaciones.modelo,
                                idsCategoriasHardware: []
                            } : undefined
                        };

                        // Inferir el tipo para el selector del formulario
                        if (dto.detalleFuente) setInitialType('FUENTE');
                        else if (dto.detalleCable) setInitialType('CABLE');
                        else if (dto.detalleHardware) setInitialType('HARDWARE');
                        else setInitialType('OTRO');

                        setInitialData(dto);
                    }
                } catch (error) {
                    console.error("Error al cargar item para editar:", error);
                } finally {
                    setLoading(false);
                }
            };
            loadItem();
        }
    }, [id, isEditing]);

    const handleSave = async (dto: ItemCreateDTO) => {
        try {
            if (isEditing) {
                await itemService.update(Number(id), dto);
                console.log("Item actualizado correctamente");
            } else {
                await itemService.create(dto);
                console.log("Item guardado correctamente");
            }
            navigate('/');
        } catch (error: any) {
            console.error("Error al guardar el item:", error);
        }
    };

    if (loading) return <div style={{ color: 'var(--brand-color)' }} className="text-neon">Cargando datos del item...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <header className="glass-panel admin-header">
                <h1 style={{ margin: 0, color: 'var(--brand-color)', textShadow: '0 0 10px rgba(117, 229, 97, 0.3)' }}>{isEditing ? 'Editar Item' : 'Nuevo Item'}</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>{isEditing ? 'Modificá los datos del componente seleccionado.' : 'Completá los datos para registrar un nuevo componente.'}</p>
            </header>
            
            <ItemForm 
                onSave={handleSave} 
                onCancel={() => navigate('/')} 
                initialData={initialData}
                initialType={initialType}
                key={initialData ? 'edit-' + id : 'new'}
            />
        </div>
    );
}
