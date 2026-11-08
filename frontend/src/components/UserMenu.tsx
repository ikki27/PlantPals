import { CalendarDays, ChevronDown, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { UserRole } from '../api/auth';
import { useAuth } from '../auth/AuthContext';
import { hasRole } from '../auth/homePath';

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Lastnik',
  sitter: 'Varuh',
  admin: 'Administrator',
};

export default function UserMenu() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="avatar">{user.displayName.charAt(0).toUpperCase()}</span>
        <span className="user-menu-name">{user.displayName}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className={`caret ${open ? 'caret-open' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="dropdown" role="menu">
          <div className="dropdown-header">
            <strong>{user.displayName}</strong>
            <span className="muted">{user.email}</span>
            <div className="role-chips">
              {user.roles.map((role) => (
                <span key={role} className="role-chip">
                  {ROLE_LABELS[role]}
                </span>
              ))}
            </div>
          </div>
          {hasRole(user.roles, 'sitter') && (
            <Link to="/availability" className="dropdown-item" role="menuitem">
              <CalendarDays size={17} strokeWidth={1.75} aria-hidden />
              Razpoložljivost
            </Link>
          )}
          <button type="button" className="dropdown-item dropdown-danger" role="menuitem" onClick={logout}>
            <LogOut size={17} strokeWidth={1.75} aria-hidden />
            Odjava
          </button>
        </div>
      )}
    </div>
  );
}
