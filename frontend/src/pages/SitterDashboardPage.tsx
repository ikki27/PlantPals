import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AddRoleCard from '../components/AddRoleCard';

export default function SitterDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Pozdravljeni, {user?.displayName}</h1>
      <p className="muted">Nadzorna plošča varuha</p>
      <div className="card add-role-card">
        <span>
          {user?.city
            ? `Vaša lokacija: ${user.city}. Uredite, kdaj ste na voljo za varstvo.`
            : 'Nastavite svojo lokacijo in obdobja, ko ste na voljo za varstvo.'}
        </span>
        <Link to="/sitter/availability" className="btn-secondary">
          Razpoložljivost
        </Link>
      </div>
      <AddRoleCard role="owner" />
    </>
  );
}
