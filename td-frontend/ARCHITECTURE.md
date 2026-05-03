# Arquitectura de TechDepot - Frontend

Este documento detalla la estructura y decisiones técnicas del frontend de TechDepot (React + TypeScript).

## 1. Estructura de Proyecto (Modular)

Hemos migrado de una Single Page Application (SPA) plana a una arquitectura basada en Paginas y Layouts para soportar el crecimiento del sistema:

- /src/layouts: Contiene los marcos visuales de la aplicacion (ej: MainLayout con Sidebar fijo).
- /src/pages: Secciones independientes de la aplicacion:
  - InventoryPage: Visualizacion y filtrado de stock con logica de inferencia.
  - ItemEditorPage: Formulario de creacion/edicion de items.
  - ParametersPage: Nueva seccion administrativa para gestionar tablas maestras (REFs).
- /src/services: Capa de comunicacion con la API (Axios). Separamos itemService de refService para mayor claridad.

## 2. Enrutamiento y Navegacion

- React Router DOM: Implementado para gestionar URLs limpias (ej: /admin/nuevo). Permite el uso de botones de navegacion del navegador sin perder el estado de la aplicacion.
- Layouts con Outlet: El Sidebar se mantiene consistente gracias al uso de <Outlet />, evitando re-renderizados innecesarios de la estructura principal.

## 3. Robustez y Calidad de Codigo

- Renderizacion Defensiva: Uso extensivo de Optional Chaining (?.) para manejar la asincronia y posibles nulos del backend, evitando el error de "pantalla blanca".
- TypeScript Estricto: Configuracion verbatimModuleSyntax para asegurar importaciones de tipos explicitas, mejorando la velocidad de compilacion y la claridad del codigo.

## 4. Evolucion V2: UI Inteligente

Con la llegada del esquema de base de datos V2, el frontend ha evolucionado:
- Formulario Dinamico: Ya no se eligen categorias manualmente. Al elegir un puerto, el formulario consulta sus capacidades y permite seleccionar la funcion (Energia/Datos/Video).
- Inferencia Visual: La tabla de inventario muestra la categoria calculada por el backend, reflejando fielmente la composicion fisica de los items sin intervencion del usuario.
- Administracion en Vivo: Capacidad de agregar nuevas marcas o parametros directamente desde los formularios de carga, sincronizando con el backend mediante peticiones POST atomicas.
