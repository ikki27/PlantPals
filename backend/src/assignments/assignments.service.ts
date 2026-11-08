import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  createdAt: Date;
}

type PopulatedPlant = { _id: Types.ObjectId; name: string };

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
      .exec();
    return assignments.map((assignment) => this.toPublic(assignment));
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

    return assignments.map((assignment) => this.toPublic(assignment));
  }

  private toPublic(assignment: CareAssignmentDocument): PublicAssignment {
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
      createdAt: assignment.createdAt,
    };
  }
}
