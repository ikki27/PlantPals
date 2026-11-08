import { api } from './client';

export type UserRole = 'owner' | 'sitter' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  city?: string;
  createdAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: 'owner' | 'sitter';
}

/** US-02: POST /api/auth/register */
export async function register(data: RegisterData): Promise<User> {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
}
