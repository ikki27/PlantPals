import { Outlet } from 'react-router-dom';
import type { UserRole } from '../api/auth';
import ForbiddenPage from '../pages/ForbiddenPage';
import { useAuth } from './AuthContext';

export default function RoleRoute({ roles }: { roles: UserRole[] }) {
  const { user } = useAuth();
  const allowed = user?.roles.some((role) => roles.includes(role)) ?? false;

  return allowed ? <Outlet /> : <ForbiddenPage />;
}
