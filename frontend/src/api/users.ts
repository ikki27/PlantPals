import type { User } from './auth';
import { api } from './client';

export async function getUsers(): Promise<User[]> {
  const res = await api.get<User[]>('/users');
  return res.data;
}

export async function addRole(role: 'owner' | 'sitter'): Promise<User> {
  const res = await api.post<User>('/users/me/roles', { role });
  return res.data;
}
