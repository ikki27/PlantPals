import { api } from './client';

export interface AvailabilityWindow {
  id: string;
  from: string;
  to: string;
}

export interface Availability {
  city: string;
  windows: AvailabilityWindow[];
}

export async function getAvailability(): Promise<Availability> {
  const res = await api.get<Availability>('/availability');
  return res.data;
}

export async function setCity(city: string): Promise<Availability> {
  const res = await api.put<Availability>('/availability/city', { city });
  return res.data;
}

export async function addWindow(from: string, to: string): Promise<Availability> {
  const res = await api.post<Availability>('/availability/windows', { from, to });
  return res.data;
}

export async function removeWindow(id: string): Promise<Availability> {
  const res = await api.delete<Availability>(`/availability/windows/${id}`);
  return res.data;
}
