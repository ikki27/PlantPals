import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Types } from 'mongoose';
import type { AuthUser } from '../auth/auth-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AddAvailabilityDto, SetCityDto } from './dto/availability.dto';
import { UserDocument } from './schemas/user.schema';
import { UserRole } from './user-role.enum';
import { UsersService } from './users.service';

export interface AvailabilityResponse {
  city: string;
  windows: { id: string; from: Date; to: Date }[];
}

@Controller('availability')
@Roles(UserRole.Sitter)
export class AvailabilityController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get(@CurrentUser() authUser: AuthUser) {
    const user = await this.usersService.findById(authUser.userId);
    return this.toResponse(user);
  }

  @Put('city')
  async setCity(@CurrentUser() authUser: AuthUser, @Body() dto: SetCityDto) {
    const user = await this.usersService.setCity(authUser.userId, dto.city);
    return this.toResponse(user);
  }

  @Post('windows')
  async addWindow(
    @CurrentUser() authUser: AuthUser,
    @Body() dto: AddAvailabilityDto,
  ) {
    const from = new Date(dto.from);
    const to = new Date(dto.to);
    if (to < from) {
      throw new BadRequestException(
        'Datum »do« ne sme biti pred datumom »od«',
      );
    }
    const user = await this.usersService.addAvailability(
      authUser.userId,
      from,
      to,
    );
    return this.toResponse(user);
  }

  @Delete('windows/:id')
  async removeWindow(
    @CurrentUser() authUser: AuthUser,
    @Param('id') id: string,
  ) {
    const user = await this.usersService.removeAvailability(
      authUser.userId,
      id,
    );
    if (!user) {
      throw new NotFoundException('Obdobje ne obstaja');
    }
    return this.toResponse(user);
  }

  private toResponse(user: UserDocument | null): AvailabilityResponse {
    if (!user) {
      throw new NotFoundException('Uporabnik ne obstaja');
    }
    const windows = user.availability
      .map((w) => {
        const window = w as typeof w & { _id: Types.ObjectId };
        return { id: window._id.toString(), from: w.from, to: w.to };
      })
      .sort((a, b) => a.from.getTime() - b.from.getTime());

    return { city: user.city ?? '', windows };
  }
}
