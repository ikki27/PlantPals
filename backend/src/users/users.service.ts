import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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

  findById(id: string): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null);
    return this.userModel.findById(id).exec();
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  addRole(id: string, role: UserRole): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null);
    return this.userModel
      .findByIdAndUpdate(id, { $addToSet: { roles: role } }, { new: true })
      .exec();
  }

  setCity(id: string, city: string): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null);
    return this.userModel
      .findByIdAndUpdate(id, { city }, { new: true })
      .exec();
  }

  addAvailability(
    id: string,
    from: Date,
    to: Date,
  ): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null);
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $push: { availability: { from, to } } },
        { new: true },
      )
      .exec();
  }

  removeAvailability(
    id: string,
    windowId: string,
  ): Promise<UserDocument | null> {
    if (!isValidObjectId(id) || !isValidObjectId(windowId)) {
      return Promise.resolve(null);
    }
    return this.userModel
      .findOneAndUpdate(
        { _id: id, 'availability._id': windowId },
        { $pull: { availability: { _id: windowId } } },
        { new: true },
      )
      .exec();
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
