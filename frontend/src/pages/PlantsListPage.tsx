import { ArrowRight, Droplets, Sprout, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getErrorMessages } from '../api/errors';
import { getPlants, type Plant } from '../api/plants';
import Meta from '../components/Meta';

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
        <Link to="/plants/new" className="btn-primary btn-inline">
          Dodaj rastlino
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!error && !plants && <p className="muted">Nalagam ...</p>}

      {plants && plants.length === 0 && (
        <div className="card empty-state">
          <p>Še nimate nobene rastline.</p>
          <Link to="/plants/new">Dodajte prvo rastlino</Link>
        </div>
      )}

      {plants && plants.length > 0 && (
        <div className="plant-grid">
          {plants.map((plant) => (
            <Link key={plant.id} to={`/plants/${plant.id}/edit`} className="plant-card card">
              <span className="plant-avatar">
                <Sprout size={34} strokeWidth={1.3} aria-hidden />
              </span>
              <h3>{plant.name}</h3>
              <p className="muted plant-species">{plant.species || 'Vrsta ni navedena'}</p>
              <div className="plant-facts">
                <Meta icon={Droplets}>Vsakih {plant.wateringFrequencyDays} dni</Meta>
                {plant.lightNeeds && <Meta icon={Sun}>{plant.lightNeeds}</Meta>}
              </div>
              <span className="plant-card-edit">
                Uredi
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
