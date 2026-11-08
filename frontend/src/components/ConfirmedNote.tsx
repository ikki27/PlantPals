import { formatDateTime, type Assignment } from '../api/assignments';

export default function ConfirmedNote({ assignment }: { assignment: Assignment }) {
  if (assignment.status !== 'potrjeno' || !assignment.returnConfirmedAt) return null;

  return (
    <div className="alert alert-success">
      ✓ Vrnitev potrjena {formatDateTime(assignment.returnConfirmedAt)}. Varstvo je zaključeno in je
      samo za branje.
    </div>
  );
}
