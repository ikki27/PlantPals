import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';
import Layout from './components/Layout';
import AdminUsersPage from './pages/AdminUsersPage';
import AssignmentDetailPage from './pages/AssignmentDetailPage';
import AssignmentFormPage from './pages/AssignmentFormPage';
import AvailabilityPage from './pages/AvailabilityPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PlantFormPage from './pages/PlantFormPage';
import PlantsListPage from './pages/PlantsListPage';
import RegisterPage from './pages/RegisterPage';
import RequestsPage from './pages/RequestsPage';
import SitterAssignmentDetailPage from './pages/SitterAssignmentDetailPage';
import SitterAssignmentsPage from './pages/SitterAssignmentsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute roles={['owner', 'sitter']} />}>
            <Route path="/requests" element={<RequestsPage />} />
          </Route>
          <Route element={<RoleRoute roles={['owner']} />}>
            <Route path="/plants" element={<PlantsListPage />} />
            <Route path="/plants/new" element={<PlantFormPage />} />
            <Route path="/plants/:id/edit" element={<PlantFormPage />} />
            <Route path="/requests/new" element={<AssignmentFormPage />} />
            <Route path="/requests/:id" element={<AssignmentDetailPage />} />
          </Route>
          <Route element={<RoleRoute roles={['sitter']} />}>
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/care" element={<SitterAssignmentsPage />} />
            <Route path="/care/:id" element={<SitterAssignmentDetailPage />} />
          </Route>
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
