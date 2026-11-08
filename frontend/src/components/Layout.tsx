import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { hasRole } from '../auth/homePath';

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
          {hasRole(user?.roles, 'owner') && (
            <>
              <NavLink to="/owner" end>
                Lastnik
              </NavLink>
              <NavLink to="/owner/plants">Moje rastline</NavLink>
              <NavLink to="/owner/requests">Zahteve</NavLink>
            </>
          )}
          {hasRole(user?.roles, 'sitter') && <NavLink to="/sitter">Varuh</NavLink>}
          {hasRole(user?.roles, 'admin') && <NavLink to="/admin">Administracija</NavLink>}
          {!user && (
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
