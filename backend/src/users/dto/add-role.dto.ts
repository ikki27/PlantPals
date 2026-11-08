import { IsIn } from 'class-validator';
import { SELF_ASSIGNABLE_ROLES, UserRole } from '../user-role.enum';

export class AddRoleDto {
  @IsIn(SELF_ASSIGNABLE_ROLES, {
    message: 'Dodate si lahko le vlogo lastnik (owner) ali varuh (sitter)',
  })
  role!: UserRole;
}
