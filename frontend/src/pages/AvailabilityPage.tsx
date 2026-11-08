import { useEffect, useState, type FormEvent } from 'react';
import { formatPeriod } from '../api/assignments';
import {
  addWindow,
  getAvailability,
  removeWindow,
  setCity,
  type Availability,
} from '../api/availability';
import { getErrorMessages } from '../api/errors';
import { useAuth } from '../auth/AuthContext';

export default function AvailabilityPage() {
  const { user, updateUser } = useAuth();

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [city, setCityInput] = useState('');
  const [cityError, setCityError] = useState<string | null>(null);
  const [cityMessage, setCityMessage] = useState<string | null>(null);
  const [savingCity, setSavingCity] = useState(false);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [windowError, setWindowError] = useState<string | null>(null);
  const [addingWindow, setAddingWindow] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    getAvailability()
      .then((data) => {
        setAvailability(data);
        setCityInput(data.city);
      })
      .catch((err) => setLoadError(getErrorMessages(err)[0]));
  }, []);

  async function handleCitySubmit(e: FormEvent) {
    e.preventDefault();
    setCityMessage(null);
    if (!city.trim()) {
      setCityError('Mesto/regija je obvezna');
      return;
    }
    setCityError(null);
    setSavingCity(true);
    try {
      const data = await setCity(city.trim());
      setAvailability(data);
      setCityInput(data.city);
      if (user) updateUser({ ...user, city: data.city });
      setCityMessage('Lokacija je shranjena.');
    } catch (err) {
      setCityError(getErrorMessages(err)[0]);
    } finally {
      setSavingCity(false);
    }
  }

  async function handleWindowSubmit(e: FormEvent) {
    e.preventDefault();
    if (!from || !to) {
      setWindowError('Vnesite datum »od« in »do«');
      return;
    }
    if (to < from) {
      setWindowError('Datum »do« ne sme biti pred datumom »od«');
      return;
    }
    setWindowError(null);
    setAddingWindow(true);
    try {
      setAvailability(await addWindow(from, to));
      setFrom('');
      setTo('');
    } catch (err) {
      setWindowError(getErrorMessages(err)[0]);
    } finally {
      setAddingWindow(false);
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    setWindowError(null);
    try {
      setAvailability(await removeWindow(id));
    } catch (err) {
      setWindowError(getErrorMessages(err)[0]);
    } finally {
      setRemovingId(null);
    }
  }

  if (loadError) return <div className="alert alert-error">{loadError}</div>;
  if (!availability) return <p className="muted">Nalagam ...</p>;

  return (
    <>
      <h1>Moja razpoložljivost</h1>
      <p className="muted">
        Prikazale se vam bodo le zahteve v vašem mestu, ki v celoti padejo v eno od vaših obdobij.
      </p>

      <section className="card section">
        <h2>Lokacija</h2>
        <form onSubmit={handleCitySubmit} className="inline-form" noValidate>
          <label className="field">
            <span>Mesto/regija</span>
            <input
              type="text"
              value={city}
              placeholder="npr. Maribor"
              onChange={(e) => {
                setCityInput(e.target.value);
                setCityError(null);
                setCityMessage(null);
              }}
            />
          </label>
          <button type="submit" className="btn-primary btn-inline" disabled={savingCity}>
            {savingCity ? 'Shranjujem ...' : 'Shrani'}
          </button>
        </form>
        {cityError && <small className="error">{cityError}</small>}
        {cityMessage && <small className="status-ok">{cityMessage}</small>}
      </section>

      <section className="card section">
        <h2>Obdobja razpoložljivosti</h2>

        {availability.windows.length === 0 ? (
          <p className="muted">Še niste dodali nobenega obdobja.</p>
        ) : (
          <ul className="window-list">
            {availability.windows.map((w) => (
              <li key={w.id}>
                <span>📅 {formatPeriod(w.from, w.to)}</span>
                <button
                  type="button"
                  className="btn-link btn-danger"
                  onClick={() => handleRemove(w.id)}
                  disabled={removingId === w.id}
                >
                  {removingId === w.id ? 'Odstranjujem ...' : 'Odstrani'}
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleWindowSubmit} className="inline-form" noValidate>
          <label className="field">
            <span>Od</span>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setWindowError(null);
              }}
            />
          </label>
          <label className="field">
            <span>Do</span>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => {
                setTo(e.target.value);
                setWindowError(null);
              }}
            />
          </label>
          <button type="submit" className="btn-primary btn-inline" disabled={addingWindow}>
            {addingWindow ? 'Dodajam ...' : '+ Dodaj obdobje'}
          </button>
        </form>
        {windowError && <small className="error">{windowError}</small>}
      </section>
    </>
  );
}
