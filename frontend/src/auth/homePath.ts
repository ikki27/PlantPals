import type { UserRole } from '../api/auth';

/** Začetni pogled glede na vlogo uporabnika (kam preusmerimo po prijavi). */
export function homePathFor(roles: UserRole[]): string {
  if (roles.includes('owner')) return '/owner';
  if (roles.includes('sitter')) return '/sitter';
  return '/';
}
