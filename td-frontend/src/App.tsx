import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout.tsx';
import InventoryPage from './pages/Inventory/InventoryPage.tsx';
import ItemEditorPage from './pages/Admin/ItemEditorPage.tsx';
import ContainerEditorPage from './pages/Admin/ContainerEditorPage.tsx';
import ParametersPage from './pages/Admin/ParametersPage.tsx';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<InventoryPage />} />
                    <Route path="admin/nuevo" element={<ItemEditorPage />} />
                    <Route path="admin/contenedores/nuevo" element={<ContainerEditorPage />} />
                    <Route path="admin/parametros" element={<ParametersPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
