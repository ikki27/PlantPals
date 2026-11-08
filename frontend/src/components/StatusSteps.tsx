import { Check } from 'lucide-react';
import { STATUS_LABELS, type AssignmentStatus } from '../api/assignments';

const FLOW: AssignmentStatus[] = ['zahtevano', 'sprejeto', 'v_teku', 'vrnjeno', 'potrjeno'];

export default function StatusSteps({ status }: { status: AssignmentStatus }) {
  if (status === 'preklicano') {
    return (
      <div className="status-steps">
        <span className="status-badge status-preklicano">Varstvo je preklicano</span>
      </div>
    );
  }

  const current = FLOW.indexOf(status);

  return (
    <ol className="status-steps">
      {FLOW.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'todo';
        return (
          <li key={step} className={`step step-${state}`}>
            <span className="step-dot">
              {index < current ? <Check size={14} strokeWidth={2.25} aria-hidden /> : index + 1}
            </span>
            <span className="step-label">{STATUS_LABELS[step]}</span>
          </li>
        );
      })}
    </ol>
  );
}
