import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class PlantDto {
  @Transform(trim)
  @MaxLength(60, { message: 'Ime je predolgo (največ 60 znakov)' })
  @IsNotEmpty({ message: 'Ime rastline je obvezno' })
  @IsString({ message: 'Ime rastline je obvezno' })
  name!: string;

  @IsOptional()
  @Transform(trim)
  @MaxLength(60, { message: 'Vrsta je predolga (največ 60 znakov)' })
  @IsString()
  species?: string;

  @Max(365, { message: 'Pogostost zalivanja je lahko največ 365 dni' })
  @Min(1, { message: 'Pogostost zalivanja mora biti vsaj 1 dan' })
  @IsInt({ message: 'Pogostost zalivanja mora biti celo število dni' })
  @IsDefined({ message: 'Pogostost zalivanja je obvezna' })
  wateringFrequencyDays!: number;

  @IsOptional()
  @Transform(trim)
  @MaxLength(100, { message: 'Opis svetlobnih potreb je predolg' })
  @IsString()
  lightNeeds?: string;

  @IsOptional()
  @Transform(trim)
  @MaxLength(1000, { message: 'Opombe so predolge (največ 1000 znakov)' })
  @IsString()
  notes?: string;
}
