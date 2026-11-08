import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAssignmentDto {
  @IsDateString({ strict: true }, { message: 'Vnesite veljaven datum začetka' })
  @IsDefined({ message: 'Datum začetka je obvezen' })
  startDate!: string;

  @IsDateString({ strict: true }, { message: 'Vnesite veljaven datum konca' })
  @IsDefined({ message: 'Datum konca je obvezen' })
  endDate!: string;

  @Transform(trim)
  @MaxLength(60, { message: 'Ime mesta/regije je predolgo' })
  @IsNotEmpty({ message: 'Mesto/regija je obvezna' })
  @IsString({ message: 'Mesto/regija je obvezna' })
  city!: string;

  @IsMongoId({ each: true, message: 'Neveljavna rastlina' })
  @ArrayUnique({ message: 'Rastlina je izbrana večkrat' })
  @ArrayMinSize(1, { message: 'Izberite vsaj eno rastlino' })
  @IsArray({ message: 'Izberite vsaj eno rastlino' })
  plantIds!: string[];
}
