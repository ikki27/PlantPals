import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { homePathFor } from '../auth/homePath';

/** Skupna postavitev: zgornja navigacija + vsebina trenutne strani. */
export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="navbar">
        <Link to="/" className="brand">
          🌿 PlantPals
        </Link>
        <nav>
          <NavLink to="/" end>
            Domov
          </NavLink>
          {user ? (
            <NavLink to={homePathFor(user.roles)}>Nadzorna plošča</NavLink>
          ) : (
            <>
              <NavLink to="/register">Registracija</NavLink>
              <NavLink to="/login">Prijava</NavLink>
            </>
          )}
        </nav>

        {user && (
          <div className="user-menu">
            <span className="muted">{user.displayName}</span>
            <button type="button" className="btn-link" onClick={logout}>
              Odjava
            </button>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
