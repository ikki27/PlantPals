import { IsDefined, IsMongoId } from 'class-validator';

export class AssignSitterDto {
  @IsMongoId({ message: 'Neveljaven varuh' })
  @IsDefined({ message: 'Izberite varuha' })
  sitterId!: string;
}
