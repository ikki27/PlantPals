import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  applyToAssignment,
  getMyAssignments,
  getOpenAssignments,
  type Assignment,
} from '../api/assignments';
import { getErrorMessages } from '../api/errors';
import { useAuth } from '../auth/AuthContext';
import { hasRole } from '../auth/homePath';
import AddRoleCard from '../components/AddRoleCard';
import OpenRequestCard from '../components/OpenRequestCard';
import OwnRequestCard from '../components/OwnRequestCard';

export default function RequestsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;
  const isOwner = hasRole(user?.roles, 'owner');
  const isSitter = hasRole(user?.roles, 'sitter');

  const [mine, setMine] = useState<Assignment[] | null>(null);
  const [mineError, setMineError] = useState<string | null>(null);
  const [open, setOpen] = useState<Assignment[] | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOwner) return;
    getMyAssignments()
      .then(setMine)
      .catch((err) => setMineError(getErrorMessages(err)[0]));
  }, [isOwner]);

  useEffect(() => {
    if (!isSitter) return;
    getOpenAssignments()
      .then(setOpen)
      .catch((err) => setOpenError(getErrorMessages(err)[0]));
  }, [isSitter]);

  async function handleApply(id: string) {
    setApplyingId(id);
    setCardErrors((e) => ({ ...e, [id]: '' }));
    try {
      const updated = await applyToAssignment(id);
      setOpen((list) => list?.map((a) => (a.id === id ? updated : a)) ?? null);
    } catch (err) {
      setCardErrors((e) => ({ ...e, [id]: getErrorMessages(err)[0] }));
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Zahteve za varstvo</h1>
        {isOwner && (
          <Link to="/requests/new" className="btn-primary btn-inline">
            Nova zahteva
          </Link>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <section className="section">
        <div className="section-title">
          <h2>Moje zahteve</h2>
          <span className="muted">Zahteve, ki ste jih oddali za svoje rastline</span>
        </div>

        {!isOwner && <AddRoleCard role="owner" />}
        {isOwner && mineError && <div className="alert alert-error">{mineError}</div>}
        {isOwner && !mineError && !mine && <p className="muted">Nalagam ...</p>}
        {isOwner && mine && mine.length === 0 && (
          <div className="card empty-state">
            <p>Še niste oddali nobene zahteve za varstvo.</p>
            <Link to="/requests/new">Oddajte prvo zahtevo</Link>
          </div>
        )}
        {isOwner && mine && mine.length > 0 && (
          <div className="assignment-list">
            {mine.map((a) => (
              <OwnRequestCard key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Zahteve drugih lastnikov</h2>
          {isSitter && (
            <span className="muted">
              Ujemajo se z vašo lokacijo{user?.city ? ` (${user.city})` : ''} in razpoložljivostjo ·{' '}
              <Link to="/availability">uredi razpoložljivost</Link>
            </span>
          )}
        </div>

        {!isSitter && <AddRoleCard role="sitter" />}
        {isSitter && openError && <div className="alert alert-error">{openError}</div>}
        {isSitter && !openError && !open && <p className="muted">Nalagam ...</p>}
        {isSitter && open && open.length === 0 && (
          <div className="card empty-state">
            <p>Trenutno ni zahtev, ki bi se ujemale z vašo lokacijo in razpoložljivostjo.</p>
            <Link to="/availability">Preverite svojo razpoložljivost</Link>
          </div>
        )}
        {isSitter && open && open.length > 0 && (
          <div className="assignment-list">
            {open.map((a) => (
              <OpenRequestCard
                key={a.id}
                assignment={a}
                applying={applyingId === a.id}
                error={cardErrors[a.id]}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
