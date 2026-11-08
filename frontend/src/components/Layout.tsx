import { Link, NavLink, Outlet } from 'react-router-dom';

/** Skupna postavitev: zgornja navigacija + vsebina trenutne strani. */
export default function Layout() {
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
          <NavLink to="/register">Registracija</NavLink>
          <NavLink to="/login">Prijava</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
