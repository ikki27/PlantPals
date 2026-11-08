import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { homePathFor } from '../auth/homePath';

export default function ForbiddenPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>403 — Nimate dostopa</h1>
      <p className="muted">Ta stran ni namenjena vaši vlogi.</p>
      <Link to={user ? homePathFor(user.roles) : '/'}>Nazaj na nadzorno ploščo</Link>
    </>
  );
}
