import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPeriod, getOpenAssignments, type Assignment } from '../api/assignments';
import { getErrorMessages } from '../api/errors';
import { useAuth } from '../auth/AuthContext';

function plantsLabel(count: number): string {
  if (count === 1) return '1 rastlina';
  if (count === 2) return '2 rastlini';
  if (count === 3 || count === 4) return `${count} rastline`;
  return `${count} rastlin`;
}

export default function OpenAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOpenAssignments()
      .then(setAssignments)
      .catch((err) => setError(getErrorMessages(err)[0]));
  }, []);

  return (
    <>
      <h1>Odprte zahteve</h1>
      <p className="muted">
        Zahteve v vašem mestu{user?.city ? ` (${user.city})` : ''}, ki v celoti padejo v eno od vaših
        obdobij razpoložljivosti.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {!error && !assignments && <p className="muted">Nalagam ...</p>}

      {assignments && assignments.length === 0 && (
        <div className="card empty-state">
          <p>Trenutno ni zahtev, ki bi se ujemale z vašo lokacijo in razpoložljivostjo.</p>
          <Link to="/sitter/availability">Preverite svojo razpoložljivost</Link>
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="assignment-list">
          {assignments.map((a) => (
            <div key={a.id} className="card assignment-card">
              <div className="assignment-main">
                <strong>📅 {formatPeriod(a.startDate, a.endDate)}</strong>
                <span>📍 {a.city}</span>
                <span className="muted">🪴 {plantsLabel(a.plantsCount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
