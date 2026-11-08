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

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

/** US-02: POST /api/auth/register */
export async function register(data: RegisterData): Promise<User> {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
}

/** US-03: POST /api/auth/login */
export async function login(data: LoginData): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
}

/** US-03: GET /api/auth/me — podatki prijavljenega uporabnika (preveri veljavnost žetona). */
export async function getMe(): Promise<User> {
  const res = await api.get<User>('/auth/me');
  return res.data;
}
