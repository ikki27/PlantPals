import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  assignSitter,
  confirmReturn,
  formatPeriod,
  getApplicants,
  getAssignment,
  STATUS_LABELS,
  type Applicant,
  type Assignment,
} from '../api/assignments';
import { getErrorMessages } from '../api/errors';
import ConfirmedNote from '../components/ConfirmedNote';
import StatusSteps from '../components/StatusSteps';

export default function AssignmentDetailPage() {
  const { id = '' } = useParams();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    try {
      const [a, list] = await Promise.all([getAssignment(id), getApplicants(id)]);
      setAssignment(a);
      setApplicants(list);
    } catch (err) {
      setLoadError(getErrorMessages(err)[0]);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAssign(applicant: Applicant) {
    setAssigningId(applicant.id);
    setActionError(null);
    setMessage(null);
    try {
      setAssignment(await assignSitter(id, applicant.id));
      setMessage(`Varuh ${applicant.displayName} je dodeljen temu varstvu.`);
    } catch (err) {
      setActionError(getErrorMessages(err)[0]);
      await load();
    } finally {
      setAssigningId(null);
    }
  }

  async function handleConfirm() {
    setConfirming(true);
    setActionError(null);
    setMessage(null);
    try {
      setAssignment(await confirmReturn(id));
    } catch (err) {
      setActionError(getErrorMessages(err)[0]);
      await load();
    } finally {
      setConfirming(false);
    }
  }

  if (loadError) {
    return (
      <>
        <div className="alert alert-error">{loadError}</div>
        <Link to="/owner/requests">← Nazaj na zahteve</Link>
      </>
    );
  }
  if (!assignment) return <p className="muted">Nalagam ...</p>;

  const canAssign = assignment.status === 'zahtevano' && !assignment.sitter;

  return (
    <>
      <Link to="/owner/requests">← Nazaj na zahteve</Link>

      <div className="page-header detail-header">
        <h1>Zahteva za varstvo</h1>
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

      {assignment.status === 'vrnjeno' && (
        <section className="card section add-role-card">
          <span>Varuh je zaključil oskrbo. Ko prevzamete rastline, potrdite vrnitev.</span>
          <button
            type="button"
            className="btn-primary btn-inline"
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? 'Potrjujem ...' : 'Potrdi vrnitev'}
          </button>
        </section>
      )}

      <section className="card section">
        <div className="assignment-main">
          <strong>📅 {formatPeriod(assignment.startDate, assignment.endDate)}</strong>
          <span>📍 {assignment.city}</span>
          <span className="muted">🪴 {assignment.plants.map((p) => p.name).join(', ')}</span>
          {assignment.sitter && <span>🧑‍🌾 Varuh: {assignment.sitter.displayName}</span>}
        </div>
      </section>

      <section className="card section">
        <h2>Kandidati ({applicants.length})</h2>

        {applicants.length === 0 ? (
          <p className="muted">Na to zahtevo se še ni javil noben varuh.</p>
        ) : (
          <ul className="window-list">
            {applicants.map((applicant) => {
              const isChosen = assignment.sitter?.id === applicant.id;
              return (
                <li key={applicant.id}>
                  <span>
                    <strong>{applicant.displayName}</strong>
                    <span className="muted"> · {applicant.city || 'mesto ni navedeno'}</span>
                  </span>
                  {isChosen ? (
                    <span className="status-badge status-potrjeno">✓ Izbran</span>
                  ) : (
                    canAssign && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleAssign(applicant)}
                        disabled={assigningId !== null}
                      >
                        {assigningId === applicant.id ? 'Dodeljujem ...' : 'Izberi'}
                      </button>
                    )
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
