import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { PlantDto } from './dto/plant.dto';
import { PlantsService } from './plants.service';

@Controller('plants')
@Roles(UserRole.Owner)
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.plantsService.findAllForOwner(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.plantsService.findOneForOwner(id, user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: PlantDto) {
    return this.plantsService.create(user.userId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: PlantDto,
  ) {
    return this.plantsService.update(id, user.userId, dto);
  }
}
