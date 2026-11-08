import { api } from './client';

export type AssignmentStatus =
  | 'zahtevano'
  | 'sprejeto'
  | 'v_teku'
  | 'vrnjeno'
  | 'potrjeno'
  | 'preklicano';

export const STATUS_LABELS: Record<AssignmentStatus, string> = {
  zahtevano: 'Zahtevano',
  sprejeto: 'Sprejeto',
  v_teku: 'V teku',
  vrnjeno: 'Vrnjeno',
  potrjeno: 'Potrjeno',
  preklicano: 'Preklicano',
};

export interface Assignment {
  id: string;
  city: string;
  startDate: string;
  endDate: string;
  status: AssignmentStatus;
  plants: { id: string; name: string }[];
  plantsCount: number;
  applicantsCount: number;
  hasApplied: boolean;
  createdAt: string;
}

export interface CreateAssignmentData {
  startDate: string;
  endDate: string;
  city: string;
  plantIds: string[];
}

export async function createAssignment(data: CreateAssignmentData): Promise<Assignment> {
  const res = await api.post<Assignment>('/assignments', data);
  return res.data;
}

export async function getMyAssignments(): Promise<Assignment[]> {
  const res = await api.get<Assignment[]>('/assignments/mine');
  return res.data;
}

export async function getOpenAssignments(): Promise<Assignment[]> {
  const res = await api.get<Assignment[]>('/assignments/open');
  return res.data;
}

export async function applyToAssignment(id: string): Promise<Assignment> {
  const res = await api.post<Assignment>(`/assignments/${id}/apply`);
  return res.data;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('sl-SI', { timeZone: 'UTC' });
}

export function formatPeriod(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}
