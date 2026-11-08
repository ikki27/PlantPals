import { CircleCheck } from 'lucide-react';
import { formatDateTime, type Assignment } from '../api/assignments';

export default function ConfirmedNote({ assignment }: { assignment: Assignment }) {
  if (assignment.status !== 'potrjeno' || !assignment.returnConfirmedAt) return null;

  return (
    <div className="alert alert-success with-icon">
      <CircleCheck size={18} strokeWidth={1.75} aria-hidden />
      <span>
        Vrnitev potrjena {formatDateTime(assignment.returnConfirmedAt)}. Varstvo je zaključeno in je
        samo za branje.
      </span>
    </div>
  );
}
