import { useEffect, useState } from 'react';
import type { User, UserRole } from '../api/auth';
import { getErrorMessages } from '../api/errors';
import { getUsers } from '../api/users';

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'lastnik',
  sitter: 'varuh',
  admin: 'administrator',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(getErrorMessages(err)[0]));
  }, []);

  return (
    <>
      <h1>Administracija</h1>
      <p className="muted">Pregled vseh uporabnikov v sistemu</p>

      {error && <div className="alert alert-error">{error}</div>}
      {!error && !users && <p className="muted">Nalagam ...</p>}

      {users && (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Prikazno ime</th>
                <th>E-naslov</th>
                <th>Vloge</th>
                <th>Registriran</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.displayName}</td>
                  <td>{u.email}</td>
                  <td>{u.roles.map((r) => ROLE_LABELS[r]).join(', ')}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString('sl-SI')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
