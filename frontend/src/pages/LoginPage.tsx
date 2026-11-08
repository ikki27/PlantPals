import { Link, useLocation } from 'react-router-dom';

/**
 * Začasna stran za prijavo — sem preusmeri registracija (US-02).
 * Prijavni obrazec bo izdelan v #8 (US-03).
 */
export default function LoginPage() {
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;

  return (
    <div className="auth-card card">
      <h1>Prijava</h1>
      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}
      <p className="muted">Prijavni obrazec bo na voljo kmalu.</p>
      <p className="muted">
        Še nimate računa? <Link to="/register">Registracija</Link>
      </p>
    </div>
  );
}
