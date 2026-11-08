import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { PlantsService } from '../plants/plants.service';
import { UsersService } from '../users/users.service';
import { AssignmentStatus } from './assignment-status.enum';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import {
  CareAssignment,
  CareAssignmentDocument,
} from './schemas/care-assignment.schema';

export interface AssignmentPlant {
  id: string;
  name: string;
}

export interface PublicAssignment {
  id: string;
  city: string;
  startDate: Date;
  endDate: Date;
  status: AssignmentStatus;
  plants: AssignmentPlant[];
  plantsCount: number;
  applicantsCount: number;
  hasApplied: boolean;
  sitter: { id: string; displayName: string } | null;
  createdAt: Date;
}

export interface Applicant {
  id: string;
  displayName: string;
  city: string;
}

type PopulatedPlant = { _id: Types.ObjectId; name: string };
type PopulatedUser = {
  _id: Types.ObjectId;
  displayName?: string;
  city?: string;
};

const NOT_FOUND = 'Zahteva ne obstaja';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(CareAssignment.name)
    private readonly assignmentModel: Model<CareAssignment>,
    private readonly plantsService: PlantsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    ownerId: string,
    dto: CreateAssignmentDto,
  ): Promise<PublicAssignment> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) {
      throw new BadRequestException(
        'Datum konca ne sme biti pred datumom začetka',
      );
    }

    const ownsAll = await this.plantsService.ownsAll(ownerId, dto.plantIds);
    if (!ownsAll) {
      throw new BadRequestException(
        'Izbrane rastline ne obstajajo ali niso vaše',
      );
    }

    const created = await this.assignmentModel.create({
      ownerId: new Types.ObjectId(ownerId),
      plantIds: dto.plantIds.map((id) => new Types.ObjectId(id)),
      city: dto.city,
      startDate,
      endDate,
      status: AssignmentStatus.Requested,
    });

    const populated = await created.populate('plantIds', 'name');
    return this.toPublic(populated);
  }

  async findAllForOwner(ownerId: string): Promise<PublicAssignment[]> {
    const assignments = await this.assignmentModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ startDate: 1 })
      .populate('plantIds', 'name')
      .populate('sitterId', 'displayName')
      .exec();
    return assignments.map((assignment) => this.toPublic(assignment));
  }

  async findOneForOwner(
    id: string,
    ownerId: string,
  ): Promise<PublicAssignment> {
    const assignment = await this.findOwnedOrThrow(id, ownerId);
    await assignment.populate([
      { path: 'plantIds', select: 'name' },
      { path: 'sitterId', select: 'displayName' },
    ]);
    return this.toPublic(assignment);
  }

  async findApplicants(id: string, ownerId: string): Promise<Applicant[]> {
    const assignment = await this.findOwnedOrThrow(id, ownerId);
    await assignment.populate('applicants', 'displayName city');
    return (assignment.applicants as unknown as PopulatedUser[])
      .filter((user) => user && user.displayName !== undefined)
      .map((user) => ({
        id: user._id.toString(),
        displayName: user.displayName ?? '',
        city: user.city ?? '',
      }));
  }

  async assignSitter(
    id: string,
    ownerId: string,
    sitterId: string,
  ): Promise<PublicAssignment> {
    const existing = await this.findOwnedOrThrow(id, ownerId);
    const sitterObjectId = new Types.ObjectId(sitterId);

    if (!existing.applicants.some((a) => a.equals(sitterObjectId))) {
      throw new BadRequestException('Izbrani varuh ni med kandidati');
    }

    const updated = await this.assignmentModel
      .findOneAndUpdate(
        {
          _id: existing._id,
          ownerId: existing.ownerId,
          status: AssignmentStatus.Requested,
          sitterId: null,
          applicants: sitterObjectId,
        },
        {
          $set: {
            sitterId: sitterObjectId,
            status: AssignmentStatus.Accepted,
          },
        },
        { new: true },
      )
      .populate('plantIds', 'name')
      .populate('sitterId', 'displayName')
      .exec();

    if (!updated) {
      throw new ConflictException(
        'Zahteva je že dodeljena ali ni več odprta',
      );
    }
    return this.toPublic(updated);
  }

  private async findOwnedOrThrow(
    id: string,
    ownerId: string,
  ): Promise<CareAssignmentDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(NOT_FOUND);
    }
    const assignment = await this.assignmentModel
      .findOne({ _id: id, ownerId: new Types.ObjectId(ownerId) })
      .exec();
    if (!assignment) {
      throw new NotFoundException(NOT_FOUND);
    }
    return assignment;
  }

  async findOpenForSitter(sitterId: string): Promise<PublicAssignment[]> {
    const sitter = await this.usersService.findById(sitterId);
    const city = sitter?.city?.trim();
    if (!sitter || !city || sitter.availability.length === 0) {
      return [];
    }

    const fitsAnyWindow = sitter.availability.map((window) => ({
      startDate: { $gte: window.from },
      endDate: { $lte: window.to },
    }));

    const assignments = await this.assignmentModel
      .find({
        status: AssignmentStatus.Requested,
        ownerId: { $ne: new Types.ObjectId(sitterId) },
        city,
        $or: fitsAnyWindow,
      })
      .collation({ locale: 'sl', strength: 2 })
      .sort({ startDate: 1 })
      .populate('plantIds', 'name')
      .exec();

    return assignments.map((assignment) =>
      this.toPublic(assignment, sitterId),
    );
  }

  async apply(id: string, sitterId: string): Promise<PublicAssignment> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(NOT_FOUND);
    }
    const sitterObjectId = new Types.ObjectId(sitterId);

    const updated = await this.assignmentModel
      .findOneAndUpdate(
        {
          _id: id,
          status: AssignmentStatus.Requested,
          ownerId: { $ne: sitterObjectId },
          applicants: { $ne: sitterObjectId },
        },
        { $addToSet: { applicants: sitterObjectId } },
        { new: true },
      )
      .populate('plantIds', 'name')
      .exec();

    if (updated) {
      return this.toPublic(updated, sitterId);
    }

    const existing = await this.assignmentModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(NOT_FOUND);
    }
    if (existing.ownerId.equals(sitterObjectId)) {
      throw new BadRequestException('Na svojo zahtevo se ne morete javiti');
    }
    if (existing.applicants.some((a) => a.equals(sitterObjectId))) {
      throw new ConflictException('Na to zahtevo ste se že javili');
    }
    throw new ConflictException('Zahteva ni več odprta za javljanje');
  }

  private toPublic(
    assignment: CareAssignmentDocument,
    viewerId?: string,
  ): PublicAssignment {
    const plants = (assignment.plantIds as unknown as PopulatedPlant[])
      .filter((plant) => plant && plant.name !== undefined)
      .map((plant) => ({ id: plant._id.toString(), name: plant.name }));

    const sitterRef = assignment.sitterId as unknown as PopulatedUser | null;
    const sitter =
      sitterRef && sitterRef.displayName !== undefined
        ? { id: sitterRef._id.toString(), displayName: sitterRef.displayName }
        : null;

    return {
      id: assignment.id as string,
      city: assignment.city,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      status: assignment.status,
      plants,
      plantsCount: assignment.plantIds.length,
      applicantsCount: assignment.applicants.length,
      hasApplied: viewerId
        ? assignment.applicants.some((a) => a.toString() === viewerId)
        : false,
      sitter,
      createdAt: assignment.createdAt,
    };
  }
}
