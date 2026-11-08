import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { PlantsService } from '../plants/plants.service';
import { UsersService } from '../users/users.service';
import { AssignmentStatus } from './assignment-status.enum';
import { findTransition, STATUS_LABELS } from './assignment-transitions';
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
  owner: { id: string; displayName: string } | null;
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

const POPULATE_ALL = [
  { path: 'plantIds', select: 'name' },
  { path: 'sitterId', select: 'displayName' },
  { path: 'ownerId', select: 'displayName' },
];

function toUserRef(
  ref: unknown,
): { id: string; displayName: string } | null {
  const user = ref as PopulatedUser | null;
  if (!user || user.displayName === undefined) return null;
  return { id: user._id.toString(), displayName: user.displayName };
}

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
      .populate(POPULATE_ALL)
      .exec();
    return assignments.map((assignment) => this.toPublic(assignment));
  }

  async findAllForSitter(sitterId: string): Promise<PublicAssignment[]> {
    const assignments = await this.assignmentModel
      .find({ sitterId: new Types.ObjectId(sitterId) })
      .sort({ startDate: 1 })
      .populate(POPULATE_ALL)
      .exec();
    return assignments.map((assignment) => this.toPublic(assignment));
  }

  async findOneForParticipant(
    id: string,
    userId: string,
  ): Promise<PublicAssignment> {
    const assignment = await this.findParticipantOrThrow(id, userId);
    await assignment.populate(POPULATE_ALL);
    return this.toPublic(assignment, userId);
  }

  async startCare(id: string, sitterId: string): Promise<PublicAssignment> {
    return this.transition(id, sitterId, AssignmentStatus.InProgress, {
      guard: (assignment) => {
        if (new Date() < assignment.startDate) {
          throw new ConflictException(
            `Varstvo se lahko začne šele na dan začetka (${assignment.startDate.toLocaleDateString('sl-SI', { timeZone: 'UTC' })})`,
          );
        }
      },
    });
  }

  async returnCare(id: string, sitterId: string): Promise<PublicAssignment> {
    return this.transition(id, sitterId, AssignmentStatus.Returned);
  }

  private async transition(
    id: string,
    userId: string,
    to: AssignmentStatus,
    options: {
      guard?: (assignment: CareAssignmentDocument) => void;
      set?: Record<string, unknown>;
    } = {},
  ): Promise<PublicAssignment> {
    const existing = await this.findParticipantOrThrow(id, userId);
    const rule = findTransition(existing.status, to);
    if (!rule) {
      throw new ConflictException(
        `Prehod iz »${STATUS_LABELS[existing.status]}« v »${STATUS_LABELS[to]}« ni dovoljen`,
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const allowed =
      rule.actor === 'owner'
        ? existing.ownerId.equals(userObjectId)
        : (existing.sitterId?.equals(userObjectId) ?? false);
    if (!allowed) {
      throw new ForbiddenException('Za to spremembo statusa nimate pravic');
    }

    options.guard?.(existing);

    const updated = await this.assignmentModel
      .findOneAndUpdate(
        { _id: existing._id, status: existing.status },
        { $set: { status: to, ...options.set } },
        { new: true },
      )
      .populate(POPULATE_ALL)
      .exec();

    if (!updated) {
      throw new ConflictException('Status varstva se je medtem spremenil');
    }
    return this.toPublic(updated, userId);
  }

  private async findParticipantOrThrow(
    id: string,
    userId: string,
  ): Promise<CareAssignmentDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(NOT_FOUND);
    }
    const userObjectId = new Types.ObjectId(userId);
    const assignment = await this.assignmentModel
      .findOne({
        _id: id,
        $or: [{ ownerId: userObjectId }, { sitterId: userObjectId }],
      })
      .exec();
    if (!assignment) {
      throw new NotFoundException(NOT_FOUND);
    }
    return assignment;
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
      .populate(POPULATE_ALL)
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
      sitter: toUserRef(assignment.sitterId),
      owner: toUserRef(assignment.ownerId),
      createdAt: assignment.createdAt,
    };
  }
}
