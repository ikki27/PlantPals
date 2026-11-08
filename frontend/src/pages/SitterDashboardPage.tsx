import { useAuth } from '../auth/AuthContext';

/** Začetni pogled varuha. Vsebino dopolnimo pri US-04 (razpoložljivost) in US-06 (odprte zahteve). */
export default function SitterDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Pozdravljeni, {user?.displayName}</h1>
      <p className="muted">Nadzorna plošča varuha</p>
      <div className="card">
        Tu bodo kmalu vaša razpoložljivost in odprte zahteve, ki se ujemajo z
        vami.
      </div>
    </>
  );
}
