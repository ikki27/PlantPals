import { UserRole } from '../users/user-role.enum';

/** Vsebina (payload) JWT žetona. */
export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
}

/** Prijavljeni uporabnik, kot ga JWT guard pripne na request (req.user). */
export interface AuthUser {
  userId: string;
  email: string;
  roles: UserRole[];
}
