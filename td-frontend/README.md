# TechDepot - Frontend Client

Este directorio contiene el cliente web de TechDepot, construido utilizando React, TypeScript y Vite. La interfaz del usuario se centra en proporcionar una experiencia fluida, reactiva y visualmente atractiva (glassmorphism y modo oscuro predeterminado).

## Estructura del Proyecto

*   `/src/components/ui/`: Contiene componentes de interfaz reutilizables como botones, inputs y paneles con efectos visuales uniformes.
*   `/src/layouts/`: Contiene `MainLayout` que define el marco visual fijo de la aplicación (incluyendo la barra lateral de navegación principal).
*   `/src/pages/`: Páginas y módulos de la aplicación:
    *   `Inventory/`: Visualización del inventario general con el motor lateral de filtrado avanzado.
    *   `Admin/`: Páginas administrativas dedicadas para gestionar los catálogos de infraestructura física:
        *   `ContainerManagerPage`: Registro y ciclo de vida de contenedores físicos.
        *   `PortManagerPage`: Gestión de puertos físicos y definición de funciones asociadas.
        *   `ProtocolManagerPage`: Matriz de compatibilidad y asignación/eliminación de protocolos de red.
        *   `BrandManagerPage`: Gestión de marcas de fabricantes.
        *   `HardwareCategoryManagerPage`: Administración de clasificaciones de componentes.
        *   `CableShieldingManagerPage`: Control de blindajes internos y externos para cables.
*   `/src/services/`: Capa de servicios para la comunicación HTTP estructurada mediante Axios:
    *   `api.ts`: Instancia base configurada de Axios.
    *   `itemService.ts`: Servicios dedicados a las operaciones del inventario.
    *   `refService.ts`: Servicios para catálogos y referencias del sistema (marcas, puertos, blindajes, etc.).
*   `/src/types/`: Definiciones y tipos estrictos de TypeScript para las entidades de la aplicación.

## Scripts Disponibles

En el directorio del frontend, podés ejecutar:

*   `npm run dev`: Inicia el servidor de desarrollo de Vite en local (generalmente en `http://localhost:5173`).
*   `npm run build`: Compila la aplicación web optimizada para producción en la carpeta `dist`. Realiza comprobaciones estrictas de TypeScript (`tsc`).
*   `npm run preview`: Previsualiza localmente el build de producción generado.

## Integración con la API y Control de Errores

Toda comunicación asíncrona se realiza a través de Axios. El frontend implementa control de errores defensivo:
1.  **Respuestas de Negocio**: Al intentar eliminar elementos que están actualmente en uso en el inventario (por ejemplo, una marca con ítems asignados o un puerto con conexiones físicas), el backend devuelve un código de estado HTTP 400 (Bad Request).
2.  **Mapeo de Errores**: El cliente captura el mensaje del backend y lo presenta en pantalla de manera amigable mediante diálogos nativos, evitando excepciones silenciosas o fallos que congelen la interfaz de usuario.
