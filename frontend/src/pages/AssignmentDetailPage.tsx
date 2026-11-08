import { CalendarDays, Check, MapPin, Sprout, UserRound } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import BackLink from '../components/BackLink';
import ConfirmedNote from '../components/ConfirmedNote';
import Meta from '../components/Meta';
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
        <BackLink to="/requests">Nazaj na zahteve</BackLink>
      </>
    );
  }
  if (!assignment) return <p className="muted">Nalagam ...</p>;

  const canAssign = assignment.status === 'zahtevano' && !assignment.sitter;

  return (
    <>
      <BackLink to="/requests">Nazaj na zahteve</BackLink>

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
          <Meta icon={CalendarDays} tone="strong">
            {formatPeriod(assignment.startDate, assignment.endDate)}
          </Meta>
          <Meta icon={MapPin}>{assignment.city}</Meta>
          <Meta icon={Sprout} tone="muted">
            {assignment.plants.map((p) => p.name).join(', ')}
          </Meta>
          {assignment.sitter && (
            <Meta icon={UserRound}>Varuh: {assignment.sitter.displayName}</Meta>
          )}
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
                    <span className="status-badge status-potrjeno with-icon">
                      <Check size={14} strokeWidth={2} aria-hidden />
                      Izbran
                    </span>
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
