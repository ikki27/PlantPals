import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../user-role.enum';

/** Obdobje razpoložljivosti varuha (vgnezdeno v User, uporabljeno v US-04). */
@Schema({ _id: true })
export class AvailabilityWindow {
  @Prop({ required: true })
  from!: Date;

  @Prop({ required: true })
  to!: Date;
}

export const AvailabilityWindowSchema =
  SchemaFactory.createForClass(AvailabilityWindow);

/** Uporabnik v katerikoli vlogi (glej docs/03-podatkovni-model.md). */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  /** Samo bcrypt hash — gesla nikoli ne shranjujemo v čisti obliki. */
  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true, trim: true })
  displayName!: string;

  @Prop({ type: [String], enum: Object.values(UserRole), required: true })
  roles!: UserRole[];

  @Prop({ trim: true })
  city?: string;

  @Prop({ type: [AvailabilityWindowSchema], default: [] })
  availability!: AvailabilityWindow[];

  createdAt!: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
