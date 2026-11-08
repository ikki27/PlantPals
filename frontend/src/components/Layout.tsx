import { Leaf } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { hasRole } from '../auth/homePath';
import UserMenu from './UserMenu';

export default function Layout() {
  const { user } = useAuth();
  const isOwner = hasRole(user?.roles, 'owner');
  const isSitter = hasRole(user?.roles, 'sitter');
  const isAdmin = hasRole(user?.roles, 'admin');

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <Leaf size={22} strokeWidth={1.75} aria-hidden />
            PlantPals
          </Link>

          {user ? (
            <>
              <nav className="main-nav">
                {(isOwner || isSitter) && (
                  <NavLink to="/" end>
                    Domov
                  </NavLink>
                )}
                {isOwner && <NavLink to="/plants">Moje rastline</NavLink>}
                {(isOwner || isSitter) && <NavLink to="/requests">Zahteve</NavLink>}
                {isSitter && <NavLink to="/care">Moja varstva</NavLink>}
                {isAdmin && <NavLink to="/admin">Administracija</NavLink>}
              </nav>
              <UserMenu />
            </>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="btn-ghost">
                Prijava
              </Link>
              <Link to="/register" className="btn-primary btn-inline">
                Registracija
              </Link>
            </div>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} PlantPals</span>
        <span>Varstvo sobnih rastlin</span>
      </footer>
    </>
  );
}
