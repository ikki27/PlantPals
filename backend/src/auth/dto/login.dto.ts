import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/** Podatki prijavnega obrazca (US-03). */
export class LoginDto {
  @IsEmail({}, { message: 'Vnesite veljaven e-naslov' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Geslo je obvezno' })
  password!: string;
}
