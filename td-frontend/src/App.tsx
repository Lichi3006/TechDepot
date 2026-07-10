import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout.tsx';
import InventoryPage from './pages/Inventory/InventoryPage.tsx';
import ItemEditorPage from './pages/Admin/ItemEditorPage.tsx';
import ContainerManagerPage from './pages/Admin/ContainerManagerPage.tsx';
import PortManagerPage from './pages/Admin/PortManagerPage.tsx';
import ProtocolManagerPage from './pages/Admin/ProtocolManagerPage.tsx';
import BrandManagerPage from './pages/Admin/BrandManagerPage.tsx';
import CableShieldingManagerPage from './pages/Admin/CableShieldingManagerPage.tsx';
import HardwareCategoryManagerPage from './pages/Admin/HardwareCategoryManagerPage.tsx';
import ColorManagerPage from './pages/Admin/ColorManagerPage.tsx';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<InventoryPage />} />
                    <Route path="admin/nuevo" element={<ItemEditorPage />} />
                    <Route path="admin/items/edit/:id" element={<ItemEditorPage />} />
                    <Route path="admin/contenedores" element={<ContainerManagerPage />} />
                    <Route path="admin/puertos" element={<PortManagerPage />} />
                    <Route path="admin/protocolos" element={<ProtocolManagerPage />} />
                    <Route path="admin/marcas" element={<BrandManagerPage />} />
                    <Route path="admin/blindajes" element={<CableShieldingManagerPage />} />
                    <Route path="admin/categorias-hardware" element={<HardwareCategoryManagerPage />} />
                    <Route path="admin/colores" element={<ColorManagerPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
