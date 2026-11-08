import { api } from './client';

export interface Plant {
  id: string;
  name: string;
  species: string;
  wateringFrequencyDays: number;
  lightNeeds: string;
  notes: string;
  createdAt: string;
}

export type PlantInput = Omit<Plant, 'id' | 'createdAt'>;

export async function getPlants(): Promise<Plant[]> {
  const res = await api.get<Plant[]>('/plants');
  return res.data;
}

export async function getPlant(id: string): Promise<Plant> {
  const res = await api.get<Plant>(`/plants/${id}`);
  return res.data;
}

export async function createPlant(data: PlantInput): Promise<Plant> {
  const res = await api.post<Plant>('/plants', data);
  return res.data;
}

export async function updatePlant(id: string, data: PlantInput): Promise<Plant> {
  const res = await api.put<Plant>(`/plants/${id}`, data);
  return res.data;
}
