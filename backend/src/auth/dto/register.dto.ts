import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SELF_ASSIGNABLE_ROLES, UserRole } from '../../users/user-role.enum';

/** Podatki registracijskega obrazca (US-02). */
export class RegisterDto {
  @IsEmail({}, { message: 'Vnesite veljaven e-naslov' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Geslo mora imeti vsaj 8 znakov' })
  @MaxLength(72, { message: 'Geslo je predolgo (največ 72 znakov)' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Prikazno ime je obvezno' })
  @MaxLength(50, { message: 'Prikazno ime je predolgo (največ 50 znakov)' })
  displayName!: string;

  @IsIn(SELF_ASSIGNABLE_ROLES, {
    message: 'Izberite vlogo: lastnik (owner) ali varuh (sitter)',
  })
  role!: UserRole;
}
