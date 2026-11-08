import type { UserRole } from '../api/auth';

export function homePathFor(roles: UserRole[]): string {
  if (roles.includes('admin') && !roles.includes('owner') && !roles.includes('sitter')) {
    return '/admin';
  }
  return '/';
}

export function hasRole(roles: UserRole[] | undefined, role: UserRole): boolean {
  return roles?.includes(role) ?? false;
}
