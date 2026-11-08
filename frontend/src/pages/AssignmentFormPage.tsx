import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAssignment } from '../api/assignments';
import { getErrorMessages } from '../api/errors';
import { getPlants, type Plant } from '../api/plants';
import { useAuth } from '../auth/AuthContext';

type FieldErrors = Partial<Record<'startDate' | 'endDate' | 'city' | 'plantIds', string>>;

export default function AssignmentFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plants, setPlants] = useState<Plant[] | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [city, setCity] = useState(user?.city ?? '');
  const [plantIds, setPlantIds] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPlants()
      .then(setPlants)
      .catch((err) => setServerErrors(getErrorMessages(err)));
  }, []);

  function togglePlant(id: string) {
    setPlantIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
    setFieldErrors((e) => ({ ...e, plantIds: undefined }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!startDate) errors.startDate = 'Datum začetka je obvezen';
    if (!endDate) errors.endDate = 'Datum konca je obvezen';
    if (startDate && endDate && endDate < startDate) {
      errors.endDate = 'Datum konca ne sme biti pred datumom začetka';
    }
    if (!city.trim()) errors.city = 'Mesto/regija je obvezna';
    if (plantIds.length === 0) errors.plantIds = 'Izberite vsaj eno rastlino';
    return errors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerErrors([]);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await createAssignment({ startDate, endDate, city: city.trim(), plantIds });
      navigate('/requests', { state: { message: 'Zahteva za varstvo je oddana.' } });
    } catch (err) {
      setServerErrors(getErrorMessages(err));
      setSubmitting(false);
    }
  }

  if (!plants && serverErrors.length === 0) return <p className="muted">Nalagam ...</p>;

  if (plants && plants.length === 0) {
    return (
      <div className="form-card card empty-state">
        <h1>Nova zahteva za varstvo</h1>
        <p>Za oddajo zahteve morate imeti vsaj eno rastlino.</p>
        <Link to="/plants/new">Dodajte rastlino</Link>
      </div>
    );
  }

  return (
    <div className="form-card card">
      <h1>Nova zahteva za varstvo</h1>

      {serverErrors.length > 0 && (
        <div className="alert alert-error" role="alert">
          {serverErrors.map((msg) => (
            <div key={msg}>{msg}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <label className="field">
            <span>Od *</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setFieldErrors((f) => ({ ...f, startDate: undefined, endDate: undefined }));
              }}
            />
            {fieldErrors.startDate && <small className="error">{fieldErrors.startDate}</small>}
          </label>

          <label className="field">
            <span>Do *</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFieldErrors((f) => ({ ...f, endDate: undefined }));
              }}
            />
            {fieldErrors.endDate && <small className="error">{fieldErrors.endDate}</small>}
          </label>
        </div>

        <label className="field">
          <span>Mesto/regija *</span>
          <input
            type="text"
            value={city}
            placeholder="npr. Maribor"
            onChange={(e) => {
              setCity(e.target.value);
              setFieldErrors((f) => ({ ...f, city: undefined }));
            }}
          />
          {fieldErrors.city && <small className="error">{fieldErrors.city}</small>}
        </label>

        <fieldset className="field">
          <legend>Rastline v varstvu *</legend>
          <div className="plant-checklist">
            {plants?.map((plant) => (
              <label key={plant.id} className="checkbox">
                <input
                  type="checkbox"
                  checked={plantIds.includes(plant.id)}
                  onChange={() => togglePlant(plant.id)}
                />
                <span>
                  {plant.name}
                  {plant.species && <small className="muted"> · {plant.species}</small>}
                </span>
              </label>
            ))}
          </div>
          {fieldErrors.plantIds && <small className="error">{fieldErrors.plantIds}</small>}
        </fieldset>

        <div className="form-actions">
          <Link to="/requests" className="btn-secondary">
            Prekliči
          </Link>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Oddajam ...' : 'Oddaj zahtevo'}
          </button>
        </div>
      </form>
    </div>
  );
}
