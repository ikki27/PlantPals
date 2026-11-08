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
  sitter: { id: string; displayName: string } | null;
  owner: { id: string; displayName: string } | null;
  returnConfirmedAt: string | null;
  createdAt: string;
}

export interface Applicant {
  id: string;
  displayName: string;
  city: string;
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

export async function getAssignment(id: string): Promise<Assignment> {
  const res = await api.get<Assignment>(`/assignments/${id}`);
  return res.data;
}

export async function getApplicants(id: string): Promise<Applicant[]> {
  const res = await api.get<Applicant[]>(`/assignments/${id}/applicants`);
  return res.data;
}

export async function assignSitter(id: string, sitterId: string): Promise<Assignment> {
  const res = await api.post<Assignment>(`/assignments/${id}/assign`, { sitterId });
  return res.data;
}

export async function getSittingAssignments(): Promise<Assignment[]> {
  const res = await api.get<Assignment[]>('/assignments/sitting');
  return res.data;
}

export async function startCare(id: string): Promise<Assignment> {
  const res = await api.post<Assignment>(`/assignments/${id}/start`);
  return res.data;
}

export async function returnCare(id: string): Promise<Assignment> {
  const res = await api.post<Assignment>(`/assignments/${id}/return`);
  return res.data;
}

export async function confirmReturn(id: string): Promise<Assignment> {
  const res = await api.post<Assignment>(`/assignments/${id}/confirm`);
  return res.data;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('sl-SI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function plantsLabel(count: number): string {
  if (count === 1) return '1 rastlina';
  if (count === 2) return '2 rastlini';
  if (count === 3 || count === 4) return `${count} rastline`;
  return `${count} rastlin`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('sl-SI', { timeZone: 'UTC' });
}

export function formatPeriod(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}
