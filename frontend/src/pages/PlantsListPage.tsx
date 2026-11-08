import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getErrorMessages } from '../api/errors';
import { getPlants, type Plant } from '../api/plants';

export default function PlantsListPage() {
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;

  const [plants, setPlants] = useState<Plant[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlants()
      .then(setPlants)
      .catch((err) => setError(getErrorMessages(err)[0]));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Moje rastline</h1>
        <Link to="/owner/plants/new" className="btn-primary btn-inline">
          + Dodaj rastlino
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!error && !plants && <p className="muted">Nalagam ...</p>}

      {plants && plants.length === 0 && (
        <div className="card empty-state">
          <p>Še nimate nobene rastline.</p>
          <Link to="/owner/plants/new">Dodajte prvo rastlino</Link>
        </div>
      )}

      {plants && plants.length > 0 && (
        <div className="plant-grid">
          {plants.map((plant) => (
            <Link key={plant.id} to={`/owner/plants/${plant.id}/edit`} className="plant-card card">
              <h3>🪴 {plant.name}</h3>
              <p className="muted">{plant.species || 'Vrsta ni navedena'}</p>
              <p>💧 Zalivanje vsakih {plant.wateringFrequencyDays} dni</p>
              {plant.lightNeeds && <p>☀️ {plant.lightNeeds}</p>}
              <span className="plant-card-edit">Uredi →</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
