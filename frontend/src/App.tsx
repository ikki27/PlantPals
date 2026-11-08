import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import RegisterPage from './pages/RegisterPage';
import SitterDashboardPage from './pages/SitterDashboardPage';

/**
 * Usmerjanje aplikacije. Nove strani dodajamo kot nove <Route> znotraj Layouta;
 * strani, ki zahtevajo prijavo, gredo znotraj <ProtectedRoute>.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/owner" element={<OwnerDashboardPage />} />
          <Route path="/sitter" element={<SitterDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
