import { useEffect, useState } from 'react';
import { api } from '../api/client';

type Health = {
  status: string;
  database: string;
};

/** Začetna stran — zaenkrat prikaže, ali je frontend povezan z API-jem in bazo. */
export default function HomePage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get<Health>('/health')
      .then((res) => setHealth(res.data))
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <h1>Dobrodošli v PlantPals</h1>
      <p>Zanesljivo varstvo sobnih rastlin, ko vas ni doma.</p>

      <div className="card">
        <strong>Stanje sistema: </strong>
        {error && <span className="status-error">API ni dosegljiv</span>}
        {!error && !health && <span>preverjam ...</span>}
        {health && (
          <span className="status-ok">
            API deluje, baza: {health.database}
          </span>
        )}
      </div>
    </>
  );
}
