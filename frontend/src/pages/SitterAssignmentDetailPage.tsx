import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  formatDate,
  formatPeriod,
  getAssignment,
  returnCare,
  startCare,
  STATUS_LABELS,
  type Assignment,
} from '../api/assignments';
import { getErrorMessages } from '../api/errors';
import ConfirmedNote from '../components/ConfirmedNote';
import StatusSteps from '../components/StatusSteps';

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function SitterAssignmentDetailPage() {
  const { id = '' } = useParams();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    getAssignment(id)
      .then(setAssignment)
      .catch((err) => setLoadError(getErrorMessages(err)[0]));
  }, [id]);

  async function runAction(action: (id: string) => Promise<Assignment>, success: string) {
    setWorking(true);
    setActionError(null);
    setMessage(null);
    try {
      setAssignment(await action(id));
      setMessage(success);
    } catch (err) {
      setActionError(getErrorMessages(err)[0]);
    } finally {
      setWorking(false);
    }
  }

  if (loadError) {
    return (
      <>
        <div className="alert alert-error">{loadError}</div>
        <Link to="/sitter/assignments">← Nazaj na moja varstva</Link>
      </>
    );
  }
  if (!assignment) return <p className="muted">Nalagam ...</p>;

  const startsLater = todayIso() < assignment.startDate.slice(0, 10);

  return (
    <>
      <Link to="/sitter/assignments">← Nazaj na moja varstva</Link>

      <div className="page-header detail-header">
        <h1>Varstvo</h1>
        <span className={`status-badge status-${assignment.status}`}>
          {STATUS_LABELS[assignment.status]}
        </span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {actionError && <div className="alert alert-error">{actionError}</div>}
      <ConfirmedNote assignment={assignment} />

      <section className="card section">
        <StatusSteps status={assignment.status} />
      </section>

      <section className="card section">
        <div className="assignment-main">
          <strong>📅 {formatPeriod(assignment.startDate, assignment.endDate)}</strong>
          <span>📍 {assignment.city}</span>
          <span>👤 Lastnik: {assignment.owner?.displayName}</span>
          <span className="muted">🪴 {assignment.plants.map((p) => p.name).join(', ')}</span>
        </div>
      </section>

      {assignment.status === 'sprejeto' && (
        <section className="card section add-role-card">
          <span>
            {startsLater
              ? `Varstvo lahko začnete na dan začetka (${formatDate(assignment.startDate)}).`
              : 'Ko prevzamete rastline, začnite varstvo.'}
          </span>
          <button
            type="button"
            className="btn-primary btn-inline"
            disabled={working || startsLater}
            onClick={() => runAction(startCare, 'Varstvo je v teku.')}
          >
            {working ? 'Shranjujem ...' : 'Začni varstvo'}
          </button>
        </section>
      )}

      {assignment.status === 'v_teku' && (
        <section className="card section add-role-card">
          <span>Ko rastline vrnete lastniku, zaključite oskrbo.</span>
          <button
            type="button"
            className="btn-primary btn-inline"
            disabled={working}
            onClick={() => runAction(returnCare, 'Oskrba je zaključena. Lastnik mora še potrditi vrnitev.')}
          >
            {working ? 'Shranjujem ...' : 'Zaključi oskrbo (vrni)'}
          </button>
        </section>
      )}
    </>
  );
}
