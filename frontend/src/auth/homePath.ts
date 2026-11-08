import type { UserRole } from '../api/auth';

export function homePathFor(roles: UserRole[]): string {
  if (roles.includes('admin')) return '/admin';
  if (roles.includes('owner')) return '/owner';
  if (roles.includes('sitter')) return '/sitter';
  return '/';
}

export function hasRole(roles: UserRole[] | undefined, role: UserRole): boolean {
  return roles?.includes(role) ?? false;
}
