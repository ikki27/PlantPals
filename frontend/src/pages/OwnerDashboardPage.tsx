import { useAuth } from '../auth/AuthContext';
import AddRoleCard from '../components/AddRoleCard';

export default function OwnerDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Pozdravljeni, {user?.displayName}</h1>
      <p className="muted">Nadzorna plošča lastnika</p>
      <div className="card">
        Tu bodo kmalu vaše rastline in zahteve za varstvo.
      </div>
      <AddRoleCard role="sitter" />
    </>
  );
}
