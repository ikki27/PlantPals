import { AssignmentStatus } from './assignment-status.enum';

export type TransitionActor = 'owner' | 'sitter';

export interface TransitionRule {
  from: AssignmentStatus;
  to: AssignmentStatus;
  actor: TransitionActor;
}

export const TRANSITIONS: TransitionRule[] = [
  {
    from: AssignmentStatus.Requested,
    to: AssignmentStatus.Accepted,
    actor: 'owner',
  },
  {
    from: AssignmentStatus.Accepted,
    to: AssignmentStatus.InProgress,
    actor: 'sitter',
  },
  {
    from: AssignmentStatus.InProgress,
    to: AssignmentStatus.Returned,
    actor: 'sitter',
  },
  {
    from: AssignmentStatus.Returned,
    to: AssignmentStatus.Confirmed,
    actor: 'owner',
  },
  {
    from: AssignmentStatus.Requested,
    to: AssignmentStatus.Cancelled,
    actor: 'owner',
  },
  {
    from: AssignmentStatus.Accepted,
    to: AssignmentStatus.Cancelled,
    actor: 'owner',
  },
];

export function findTransition(
  from: AssignmentStatus,
  to: AssignmentStatus,
): TransitionRule | undefined {
  return TRANSITIONS.find((rule) => rule.from === from && rule.to === to);
}

export const STATUS_LABELS: Record<AssignmentStatus, string> = {
  [AssignmentStatus.Requested]: 'zahtevano',
  [AssignmentStatus.Accepted]: 'sprejeto',
  [AssignmentStatus.InProgress]: 'v teku',
  [AssignmentStatus.Returned]: 'vrnjeno',
  [AssignmentStatus.Confirmed]: 'potrjeno',
  [AssignmentStatus.Cancelled]: 'preklicano',
};
