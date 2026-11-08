import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessages } from '../api/errors';
import { useAuth } from '../auth/AuthContext';
import { homePathFor } from '../auth/homePath';

/** Prijava z e-naslovom in geslom (US-03). */
export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Že prijavljen uporabnik ne potrebuje prijavne strani.
  if (user && !submitting) {
    return <Navigate to={homePathFor(user.roles)} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrors(['Vnesite e-naslov in geslo']);
      return;
    }

    setErrors([]);
    setSubmitting(true);
    try {
      const loggedIn = await login({ email: email.trim(), password });
      navigate(homePathFor(loggedIn.roles), { replace: true });
    } catch (err) {
      setErrors(getErrorMessages(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card card">
      <h1>Prijava</h1>

      {message && errors.length === 0 && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      {errors.length > 0 && (
        <div className="alert alert-error" role="alert">
          {errors.map((msg) => (
            <div key={msg}>{msg}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>E-naslov</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Geslo</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Prijavljam ...' : 'Prijava'}
        </button>
      </form>

      <p className="muted">
        Še nimate računa? <Link to="/register">Registracija</Link>
      </p>
    </div>
  );
}
