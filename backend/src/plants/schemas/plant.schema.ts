import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Plant {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  ownerId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true, default: '' })
  species!: string;

  @Prop({ required: true, min: 1 })
  wateringFrequencyDays!: number;

  @Prop({ trim: true, default: '' })
  lightNeeds!: string;

  @Prop({ trim: true, default: '' })
  notes!: string;

  createdAt!: Date;
}

export type PlantDocument = HydratedDocument<Plant>;

export const PlantSchema = SchemaFactory.createForClass(Plant);
