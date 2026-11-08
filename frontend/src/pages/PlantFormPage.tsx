import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessages } from '../api/errors';
import { createPlant, getPlant, updatePlant, type PlantInput } from '../api/plants';

const LIGHT_OPTIONS = [
  'Senca',
  'Polsenca',
  'Svetlo, posredna svetloba',
  'Neposredno sonce',
];

type FormState = {
  name: string;
  species: string;
  wateringFrequencyDays: string;
  lightNeeds: string;
  notes: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  name: '',
  species: '',
  wateringFrequencyDays: '',
  lightNeeds: '',
  notes: '',
};

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'Ime rastline je obvezno';

  const days = Number(form.wateringFrequencyDays);
  if (!form.wateringFrequencyDays.trim()) {
    errors.wateringFrequencyDays = 'Pogostost zalivanja je obvezna';
  } else if (!Number.isInteger(days) || days < 1) {
    errors.wateringFrequencyDays = 'Vnesite celo število dni, večje od 0';
  } else if (days > 365) {
    errors.wateringFrequencyDays = 'Največ 365 dni';
  }
  return errors;
}

function toInput(form: FormState): PlantInput {
  return {
    name: form.name.trim(),
    species: form.species.trim(),
    wateringFrequencyDays: Number(form.wateringFrequencyDays),
    lightNeeds: form.lightNeeds,
    notes: form.notes.trim(),
  };
}

export default function PlantFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPlant(id)
      .then((plant) =>
        setForm({
          name: plant.name,
          species: plant.species,
          wateringFrequencyDays: String(plant.wateringFrequencyDays),
          lightNeeds: plant.lightNeeds,
          notes: plant.notes,
        }),
      )
      .catch((err) => setServerErrors(getErrorMessages(err)))
      .finally(() => setLoading(false));
  }, [id]);

  function update(key: keyof FormState, value: string) {
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
      if (id) {
        await updatePlant(id, toInput(form));
      } else {
        await createPlant(toInput(form));
      }
      navigate('/owner/plants', {
        state: { message: isEdit ? 'Spremembe so shranjene.' : 'Rastlina je dodana.' },
      });
    } catch (err) {
      setServerErrors(getErrorMessages(err));
      setSubmitting(false);
    }
  }

  if (loading) return <p className="muted">Nalagam ...</p>;

  const lightOptions =
    form.lightNeeds && !LIGHT_OPTIONS.includes(form.lightNeeds)
      ? [...LIGHT_OPTIONS, form.lightNeeds]
      : LIGHT_OPTIONS;

  return (
    <div className="form-card card">
      <h1>{isEdit ? 'Uredi rastlino' : 'Nova rastlina'}</h1>

      {serverErrors.length > 0 && (
        <div className="alert alert-error" role="alert">
          {serverErrors.map((msg) => (
            <div key={msg}>{msg}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Ime *</span>
          <input
            type="text"
            value={form.name}
            placeholder="npr. Monstera v dnevni sobi"
            onChange={(e) => update('name', e.target.value)}
          />
          {fieldErrors.name && <small className="error">{fieldErrors.name}</small>}
        </label>

        <label className="field">
          <span>Vrsta</span>
          <input
            type="text"
            value={form.species}
            placeholder="npr. Monstera deliciosa"
            onChange={(e) => update('species', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Pogostost zalivanja (vsakih koliko dni) *</span>
          <input
            type="number"
            min={1}
            max={365}
            step={1}
            value={form.wateringFrequencyDays}
            onChange={(e) => update('wateringFrequencyDays', e.target.value)}
          />
          {fieldErrors.wateringFrequencyDays && (
            <small className="error">{fieldErrors.wateringFrequencyDays}</small>
          )}
        </label>

        <label className="field">
          <span>Svetlobne potrebe</span>
          <select
            value={form.lightNeeds}
            onChange={(e) => update('lightNeeds', e.target.value)}
          >
            <option value="">— izberite —</option>
            {lightOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Opombe in navodila za oskrbo</span>
          <textarea
            rows={4}
            value={form.notes}
            placeholder="npr. zalivaj z odstano vodo, listov ne pršiti"
            onChange={(e) => update('notes', e.target.value)}
          />
        </label>

        <div className="form-actions">
          <Link to="/owner/plants" className="btn-secondary">
            Prekliči
          </Link>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Shranjujem ...' : 'Shrani'}
          </button>
        </div>
      </form>
    </div>
  );
}
