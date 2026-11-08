/** Vloge uporabnikov v sistemu. */
export enum UserRole {
  Owner = 'owner',
  Sitter = 'sitter',
  Admin = 'admin',
}

/** Vloge, ki si jih uporabnik lahko izbere sam ob registraciji (admin ne). */
export const SELF_ASSIGNABLE_ROLES = [UserRole.Owner, UserRole.Sitter];
