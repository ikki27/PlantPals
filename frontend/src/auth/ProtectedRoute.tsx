import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/** Strani znotraj te poti so dostopne le prijavljenim uporabnikom. */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="muted">Nalagam ...</p>;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: 'Za ogled te strani se prijavite.', from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
