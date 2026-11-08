import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Plant } from '../../plants/schemas/plant.schema';
import { User } from '../../users/schemas/user.schema';
import { AssignmentStatus } from '../assignment-status.enum';

@Schema({ _id: true })
export class CareLogEntry {
  @Prop({ required: true })
  date!: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  authorId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  task!: string;

  @Prop({ trim: true, default: '' })
  notes!: string;
}

export const CareLogEntrySchema = SchemaFactory.createForClass(CareLogEntry);

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class CareAssignment {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  ownerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  sitterId!: Types.ObjectId | null;

  @Prop({ type: [{ type: Types.ObjectId, ref: Plant.name }], required: true })
  plantIds!: Types.ObjectId[];

  @Prop({ required: true, trim: true })
  city!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({
    type: String,
    enum: Object.values(AssignmentStatus),
    default: AssignmentStatus.Requested,
    index: true,
  })
  status!: AssignmentStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  applicants!: Types.ObjectId[];

  @Prop({ type: [CareLogEntrySchema], default: [] })
  careLog!: CareLogEntry[];

  @Prop({ type: Date, default: null })
  returnConfirmedAt!: Date | null;

  createdAt!: Date;
}

export type CareAssignmentDocument = HydratedDocument<CareAssignment>;

export const CareAssignmentSchema = SchemaFactory.createForClass(CareAssignment);
