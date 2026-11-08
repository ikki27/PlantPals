import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { PlantDto } from './dto/plant.dto';
import { Plant, PlantDocument } from './schemas/plant.schema';

export interface PublicPlant {
  id: string;
  name: string;
  species: string;
  wateringFrequencyDays: number;
  lightNeeds: string;
  notes: string;
  createdAt: Date;
}

const NOT_FOUND = 'Rastlina ne obstaja';

@Injectable()
export class PlantsService {
  constructor(
    @InjectModel(Plant.name) private readonly plantModel: Model<Plant>,
  ) {}

  async findAllForOwner(ownerId: string): Promise<PublicPlant[]> {
    const plants = await this.plantModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ createdAt: -1 })
      .exec();
    return plants.map((plant) => this.toPublic(plant));
  }

  async findOneForOwner(id: string, ownerId: string): Promise<PublicPlant> {
    if (!isValidObjectId(id)) throw new NotFoundException(NOT_FOUND);
    const plant = await this.plantModel
      .findOne({ _id: id, ownerId: new Types.ObjectId(ownerId) })
      .exec();
    if (!plant) throw new NotFoundException(NOT_FOUND);
    return this.toPublic(plant);
  }

  async ownsAll(ownerId: string, plantIds: string[]): Promise<boolean> {
    if (plantIds.some((id) => !isValidObjectId(id))) return false;
    const count = await this.plantModel
      .countDocuments({
        _id: { $in: plantIds },
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();
    return count === plantIds.length;
  }

  async create(ownerId: string, dto: PlantDto): Promise<PublicPlant> {
    const plant = await this.plantModel.create({
      ...dto,
      ownerId: new Types.ObjectId(ownerId),
    });
    return this.toPublic(plant);
  }

  async update(
    id: string,
    ownerId: string,
    dto: PlantDto,
  ): Promise<PublicPlant> {
    if (!isValidObjectId(id)) throw new NotFoundException(NOT_FOUND);
    const plant = await this.plantModel
      .findOneAndUpdate(
        { _id: id, ownerId: new Types.ObjectId(ownerId) },
        {
          name: dto.name,
          species: dto.species ?? '',
          wateringFrequencyDays: dto.wateringFrequencyDays,
          lightNeeds: dto.lightNeeds ?? '',
          notes: dto.notes ?? '',
        },
        { new: true, runValidators: true },
      )
      .exec();
    if (!plant) throw new NotFoundException(NOT_FOUND);
    return this.toPublic(plant);
  }

  private toPublic(plant: PlantDocument): PublicPlant {
    return {
      id: plant.id as string,
      name: plant.name,
      species: plant.species,
      wateringFrequencyDays: plant.wateringFrequencyDays,
      lightNeeds: plant.lightNeeds,
      notes: plant.notes,
      createdAt: plant.createdAt,
    };
  }
}
