import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
      <h1>Moja varstva</h1>
      <p className="muted">Varstva, za katera vas je lastnik izbral.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {!error && !assignments && <p className="muted">Nalagam ...</p>}

      {assignments && assignments.length === 0 && (
        <div className="card empty-state">
          <p>Zaenkrat vas še noben lastnik ni izbral za varstvo.</p>
          <Link to="/sitter/requests">Poglejte odprte zahteve</Link>
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="assignment-list">
          {assignments.map((a) => (
            <Link key={a.id} to={`/sitter/assignments/${a.id}`} className="card assignment-card card-link">
              <div className="assignment-main">
                <strong>📅 {formatPeriod(a.startDate, a.endDate)}</strong>
                <span>📍 {a.city}</span>
                <span className="muted">👤 Lastnik: {a.owner?.displayName}</span>
                <span className="muted">🪴 {a.plants.map((p) => p.name).join(', ')}</span>
              </div>
              <span className={`status-badge status-${a.status}`}>{STATUS_LABELS[a.status]}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
