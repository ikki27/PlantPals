import { useAuth } from '../auth/AuthContext';
import AddRoleCard from '../components/AddRoleCard';

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
      <AddRoleCard role="owner" />
    </>
  );
}
