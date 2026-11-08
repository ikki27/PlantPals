import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class SetCityDto {
  @Transform(trim)
  @MaxLength(60, { message: 'Ime mesta/regije je predolgo' })
  @IsNotEmpty({ message: 'Mesto/regija je obvezna' })
  @IsString({ message: 'Mesto/regija je obvezna' })
  city!: string;
}

export class AddAvailabilityDto {
  @IsDateString({ strict: true }, { message: 'Vnesite veljaven datum »od«' })
  @IsDefined({ message: 'Datum »od« je obvezen' })
  from!: string;

  @IsDateString({ strict: true }, { message: 'Vnesite veljaven datum »do«' })
  @IsDefined({ message: 'Datum »do« je obvezen' })
  to!: string;
}
