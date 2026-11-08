import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from './user-role.enum';
import { User, UserDocument } from './schemas/user.schema';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  displayName: string;
  roles: UserRole[];
}

/** Javni podatki uporabnika — brez gesla, primerni za vračanje iz API-ja. */
export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  city?: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  create(data: CreateUserData): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  toPublic(user: UserDocument): PublicUser {
    return {
      id: user.id as string,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles,
      city: user.city,
      createdAt: user.createdAt,
    };
  }
}
