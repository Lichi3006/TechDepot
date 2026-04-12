import { useState } from 'react';

interface Item {
    id: number; // IdItem
    marca: string; // Nombre de REF_Marca
    estado: string; // Nombre de REF_Estado
    contenedor: string; // QrUUID de Contenedor
    color: string; // Nombre de Color/REF_Color

    // Categorías: como un item puede tener muchas, usamos un array de strings
    categorias: string[];

    // Puertos y Protocolos: podríamos agruparlos para la vista de íconos
    conexiones: {
        puerto: string;
        protocolo?: string;
        genero: boolean; // BIT en SQL
    }[];

    tipo: 'CABLE/ADAPTADOR' | 'HARDWARE' | 'FUENTE';
    especificaciones: {
        amperajeMax?: number; // Para cables de poder o fuentes
        voltaje?: number;     // Para fuentes
        largo?: number;       // Para cables
        modelo?: string;      // Para hardware
    };
}

 export default function App() {
        // Inicializamos con los datos para evitar el bucle infinito
        const [items] = useState<Item[]>([
            {
                id: 1,
                marca: "Samsung",
                estado: "Nuevo",
                contenedor: "CONT-001-A2",
                color: "Blanco",
                categorias: ["Cables", "Energía", "USB-C"],
                conexiones: [
                    { puerto: "USB-C", protocolo: "Power Delivery 3.0", genero: true },
                    { puerto: "USB-C", protocolo: "Power Delivery 3.0", genero: true }
                ],
                tipo: 'CABLE/ADAPTADOR',
                especificaciones: { largo: 2, amperajeMax: 5 }
            },
            {
                id: 2,
                marca: "EVGA",
                estado: "Usado",
                contenedor: "CONT-999-F4",
                color: "Negro",
                categorias: ["Fuentes", "Hardware", "PC"],
                conexiones: [{ puerto: "AC Plug", genero: true }],
                tipo: 'FUENTE',
                especificaciones: { voltaje: 12, amperajeMax: 60 }
            },
            {
                id: 3,
                marca: "TP-Link",
                estado: "Nuevo",
                contenedor: "CONT-005-B1",
                color: "Gris",
                categorias: ["Networking", "Switch", "Hardware"],
                conexiones: [{ puerto: "RJ45", protocolo: "Gigabit Ethernet", genero: false }],
                tipo: 'HARDWARE',
                especificaciones: { modelo: "TL-SG108" }
            }
        ]);

     return (
         <table
             border={1}
             style={{
                 font : '16px Arial', // Bajé un poco el tamaño para que entre todo
                 borderCollapse: 'collapse',
                 width: '100%',
                 textAlign: 'center',
                 tableLayout: 'fixed'
             }}
         >
             <thead>
             <tr>
                 <th>Conexiones</th>
                 <th>Contenedor</th>
                 <th>Marca</th>
                 <th>Estado</th>
                 <th>Color</th>
                 <th>Especificaciones</th>
             </tr>
             </thead>
             <tbody>
             {/* PRIMER BUCLE: Genera una fila <tr> por cada Item */}
             {items.map((item) => (
                 <tr key={item.id}>
                     <th>
                         {item.conexiones.map((conexion, index) => (
                             <div key={index}>
                                 {conexion.puerto}  {conexion.protocolo ?? ''}  {conexion.genero}  {conexion.genero ? 'M' : 'F'}
                            </div>
                            ))}
                     </th>
                     <td>{item.contenedor}</td>
                     <td>{item.marca}</td>
                     <td>{item.estado}</td>
                     <td>{item.color}</td>
                     <td>
                         {item.especificaciones.largo}  {item.especificaciones.amperajeMax}  {item.especificaciones.voltaje}  {item.especificaciones.modelo}
                     </td>
                 </tr>
             ))}
             </tbody>
         </table>
     );
}