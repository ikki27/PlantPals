import { CalendarDays, MapPin, Sprout, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import {
  formatPeriod,
  getSittingAssignments,
  STATUS_LABELS,
  type Assignment,
} from '../api/assignments';
import { getErrorMessages } from '../api/errors';

export default function SitterAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSittingAssignments()
      .then(setAssignments)
      .catch((err) => setError(getErrorMessages(err)[0]));
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Moja varstva</h1>
          <p className="muted page-subtitle">Varstva, za katera vas je lastnik izbral.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {!error && !assignments && <p className="muted">Nalagam ...</p>}

      {assignments && assignments.length === 0 && (
        <div className="card empty-state">
          <p>Zaenkrat vas še noben lastnik ni izbral za varstvo.</p>
          <Link to="/requests">Poglejte odprte zahteve</Link>
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="assignment-list">
          {assignments.map((a) => (
            <Link key={a.id} to={`/care/${a.id}`} className="card assignment-card card-link">
              <div className="assignment-main">
                <Meta icon={CalendarDays} tone="strong">
                  {formatPeriod(a.startDate, a.endDate)}
                </Meta>
                <div className="meta-row">
                  <Meta icon={MapPin}>{a.city}</Meta>
                  <Meta icon={UserRound} tone="muted">
                    Lastnik: {a.owner?.displayName}
                  </Meta>
                </div>
                <Meta icon={Sprout} tone="muted">
                  {a.plants.map((p) => p.name).join(', ')}
                </Meta>
              </div>
              <span className={`status-badge status-${a.status}`}>{STATUS_LABELS[a.status]}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
