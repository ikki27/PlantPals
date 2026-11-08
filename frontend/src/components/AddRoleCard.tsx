import { HandHeart, Sprout } from 'lucide-react';
import { useState } from 'react';
import { getErrorMessages } from '../api/errors';
import { addRole } from '../api/users';
import { useAuth } from '../auth/AuthContext';
import { hasRole } from '../auth/homePath';
import IconBadge from './IconBadge';

const ROLE_INFO = {
  owner: {
    icon: Sprout,
    title: 'Želite tudi oddati svoje rastline v varstvo?',
    button: 'Postani tudi lastnik',
  },
  sitter: {
    icon: HandHeart,
    title: 'Želite tudi skrbeti za rastline drugih?',
    button: 'Postani tudi varuh',
  },
} as const;

export default function AddRoleCard({ role }: { role: 'owner' | 'sitter' }) {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (hasRole(user?.roles, role)) return null;

  const info = ROLE_INFO[role];

  async function handleClick() {
    setSubmitting(true);
    setError(null);
    try {
      updateUser(await addRole(role));
    } catch (err) {
      setError(getErrorMessages(err)[0]);
      setSubmitting(false);
    }
  }

  return (
    <div className="card callout">
      <IconBadge icon={info.icon} />
      <span className="callout-text">{info.title}</span>
      <button type="button" className="btn-secondary" onClick={handleClick} disabled={submitting}>
        {info.button}
      </button>
      {error && <small className="error">{error}</small>}
    </div>
  );
}
