import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, type RegisterData } from '../api/auth';
import { getErrorMessages } from '../api/errors';

const MIN_PASSWORD_LENGTH = 8;

type FieldErrors = Partial<Record<keyof RegisterData, string>>;

/** Preverjanje na strani odjemalca — pred oddajo obrazca (US-02). */
function validate(form: RegisterData): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.email.trim()) errors.email = 'E-naslov je obvezen';
  if (form.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Geslo mora imeti vsaj ${MIN_PASSWORD_LENGTH} znakov`;
  }
  if (!form.displayName.trim()) errors.displayName = 'Prikazno ime je obvezno';
  return errors;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterData>({
    email: '',
    password: '',
    displayName: '',
    role: 'owner',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof RegisterData>(key: K, value: RegisterData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerErrors([]);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await register({ ...form, email: form.email.trim() });
      navigate('/login', {
        state: { message: 'Registracija je uspela. Zdaj se lahko prijavite.' },
      });
    } catch (err) {
      setServerErrors(getErrorMessages(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card card">
      <h1>Registracija</h1>

      {serverErrors.length > 0 && (
        <div className="alert alert-error" role="alert">
          {serverErrors.map((msg) => (
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
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
          {fieldErrors.email && <small className="error">{fieldErrors.email}</small>}
        </label>

        <label className="field">
          <span>Geslo</span>
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
          />
          {fieldErrors.password ? (
            <small className="error">{fieldErrors.password}</small>
          ) : (
            <small className="hint">Vsaj {MIN_PASSWORD_LENGTH} znakov</small>
          )}
        </label>

        <label className="field">
          <span>Prikazno ime</span>
          <input
            type="text"
            autoComplete="nickname"
            value={form.displayName}
            onChange={(e) => update('displayName', e.target.value)}
          />
          {fieldErrors.displayName && (
            <small className="error">{fieldErrors.displayName}</small>
          )}
        </label>

        <fieldset className="field">
          <legend>Vloga</legend>
          <label className="radio">
            <input
              type="radio"
              name="role"
              checked={form.role === 'owner'}
              onChange={() => update('role', 'owner')}
            />
            Lastnik — iščem varuha za svoje rastline
          </label>
          <label className="radio">
            <input
              type="radio"
              name="role"
              checked={form.role === 'sitter'}
              onChange={() => update('role', 'sitter')}
            />
            Varuh — skrbim za rastline drugih
          </label>
        </fieldset>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Pošiljam ...' : 'Ustvari račun'}
        </button>
      </form>

      <p className="muted">
        Že imate račun? <Link to="/login">Prijava</Link>
      </p>
    </div>
  );
}
