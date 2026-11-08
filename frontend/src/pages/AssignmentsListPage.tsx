import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  formatPeriod,
  getMyAssignments,
  STATUS_LABELS,
  type Assignment,
} from '../api/assignments';
import { getErrorMessages } from '../api/errors';

export default function AssignmentsListPage() {
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;

  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyAssignments()
      .then(setAssignments)
      .catch((err) => setError(getErrorMessages(err)[0]));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Moje zahteve za varstvo</h1>
        <Link to="/owner/requests/new" className="btn-primary btn-inline">
          + Nova zahteva
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!error && !assignments && <p className="muted">Nalagam ...</p>}

      {assignments && assignments.length === 0 && (
        <div className="card empty-state">
          <p>Še niste oddali nobene zahteve za varstvo.</p>
          <Link to="/owner/requests/new">Oddajte prvo zahtevo</Link>
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="assignment-list">
          {assignments.map((a) => (
            <div key={a.id} className="card assignment-card">
              <div className="assignment-main">
                <strong>📅 {formatPeriod(a.startDate, a.endDate)}</strong>
                <span>📍 {a.city}</span>
                <span className="muted">
                  🪴 {a.plants.map((p) => p.name).join(', ') || 'Rastline niso več na voljo'}
                </span>
              </div>
              <span className={`status-badge status-${a.status}`}>{STATUS_LABELS[a.status]}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
