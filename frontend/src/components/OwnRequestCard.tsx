import { CalendarDays, CircleAlert, CircleCheck, MapPin, Sprout, UserRound, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  formatDateTime,
  formatPeriod,
  STATUS_LABELS,
  type Assignment,
} from '../api/assignments';
import Meta from './Meta';

export default function OwnRequestCard({ assignment: a }: { assignment: Assignment }) {
  return (
    <Link to={`/requests/${a.id}`} className="card assignment-card card-link">
      <div className="assignment-main">
        <Meta icon={CalendarDays} tone="strong">
          {formatPeriod(a.startDate, a.endDate)}
        </Meta>
        <div className="meta-row">
          <Meta icon={MapPin}>{a.city}</Meta>
          <Meta icon={Sprout} tone="muted">
            {a.plants.map((p) => p.name).join(', ') || 'Rastline niso več na voljo'}
          </Meta>
        </div>
        {a.sitter ? (
          <Meta icon={UserRound}>Varuh: {a.sitter.displayName}</Meta>
        ) : (
          a.status === 'zahtevano' && (
            <Meta icon={Users} tone="muted">
              Kandidati: {a.applicantsCount}
            </Meta>
          )
        )}
        {a.status === 'vrnjeno' && (
          <Meta icon={CircleAlert} tone="warning">
            Potrdite vrnitev rastlin
          </Meta>
        )}
        {a.returnConfirmedAt && (
          <Meta icon={CircleCheck} tone="muted">
            Potrjeno {formatDateTime(a.returnConfirmedAt)}
          </Meta>
        )}
      </div>
      <span className={`status-badge status-${a.status}`}>{STATUS_LABELS[a.status]}</span>
    </Link>
  );
}
