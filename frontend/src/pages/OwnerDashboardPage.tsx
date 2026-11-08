import { useAuth } from '../auth/AuthContext';

/** Začetni pogled lastnika. Vsebino dopolnimo pri US-01 (rastline) in US-05 (zahteve). */
export default function OwnerDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Pozdravljeni, {user?.displayName}</h1>
      <p className="muted">Nadzorna plošča lastnika</p>
      <div className="card">
        Tu bodo kmalu vaše rastline in zahteve za varstvo.
      </div>
    </>
  );
}
