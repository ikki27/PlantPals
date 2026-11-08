import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AddRoleCard from '../components/AddRoleCard';

export default function OwnerDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Pozdravljeni, {user?.displayName}</h1>
      <p className="muted">Nadzorna plošča lastnika</p>
      <div className="card add-role-card">
        <span>Vodite svoje rastline in navodila za oskrbo.</span>
        <Link to="/owner/plants" className="btn-secondary">
          Moje rastline
        </Link>
      </div>
      <div className="card add-role-card">
        <span>Greste na pot? Poiščite varuha za svoje rastline.</span>
        <Link to="/owner/requests" className="btn-secondary">
          Zahteve za varstvo
        </Link>
      </div>
      <AddRoleCard role="sitter" />
    </>
  );
}
