import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';
import Layout from './components/Layout';
import AdminUsersPage from './pages/AdminUsersPage';
import AssignmentDetailPage from './pages/AssignmentDetailPage';
import AssignmentFormPage from './pages/AssignmentFormPage';
import AssignmentsListPage from './pages/AssignmentsListPage';
import AvailabilityPage from './pages/AvailabilityPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import OpenAssignmentsPage from './pages/OpenAssignmentsPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import PlantFormPage from './pages/PlantFormPage';
import PlantsListPage from './pages/PlantsListPage';
import RegisterPage from './pages/RegisterPage';
import SitterAssignmentDetailPage from './pages/SitterAssignmentDetailPage';
import SitterAssignmentsPage from './pages/SitterAssignmentsPage';
import SitterDashboardPage from './pages/SitterDashboardPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute roles={['owner']} />}>
            <Route path="/owner" element={<OwnerDashboardPage />} />
            <Route path="/owner/plants" element={<PlantsListPage />} />
            <Route path="/owner/plants/new" element={<PlantFormPage />} />
            <Route path="/owner/plants/:id/edit" element={<PlantFormPage />} />
            <Route path="/owner/requests" element={<AssignmentsListPage />} />
            <Route path="/owner/requests/new" element={<AssignmentFormPage />} />
            <Route path="/owner/requests/:id" element={<AssignmentDetailPage />} />
          </Route>
          <Route element={<RoleRoute roles={['sitter']} />}>
            <Route path="/sitter" element={<SitterDashboardPage />} />
            <Route path="/sitter/availability" element={<AvailabilityPage />} />
            <Route path="/sitter/requests" element={<OpenAssignmentsPage />} />
            <Route path="/sitter/assignments" element={<SitterAssignmentsPage />} />
            <Route path="/sitter/assignments/:id" element={<SitterAssignmentDetailPage />} />
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
