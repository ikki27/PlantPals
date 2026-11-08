import { CalendarDays, Check, MapPin, Sprout } from 'lucide-react';
import { formatPeriod, plantsLabel, type Assignment } from '../api/assignments';
import Meta from './Meta';

type Props = {
  assignment: Assignment;
  applying: boolean;
  error?: string;
  onApply: (id: string) => void;
};

export default function OpenRequestCard({ assignment: a, applying, error, onApply }: Props) {
  return (
    <div className="card assignment-card">
      <div className="assignment-main">
        <Meta icon={CalendarDays} tone="strong">
          {formatPeriod(a.startDate, a.endDate)}
        </Meta>
        <div className="meta-row">
          <Meta icon={MapPin}>{a.city}</Meta>
          <Meta icon={Sprout} tone="muted">
            {plantsLabel(a.plantsCount)}
          </Meta>
        </div>
        {error && <small className="error">{error}</small>}
      </div>

      <div className="assignment-actions">
        {a.hasApplied ? (
          <span className="status-badge status-potrjeno with-icon">
            <Check size={14} strokeWidth={2} aria-hidden />
            Ste med kandidati
          </span>
        ) : (
          <button
            type="button"
            className="btn-primary btn-inline"
            onClick={() => onApply(a.id)}
            disabled={applying}
          >
            {applying ? 'Javljam ...' : 'Javi se'}
          </button>
        )}
      </div>
    </div>
  );
}
