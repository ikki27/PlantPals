import { Body, Controller, Get, Post } from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(UserRole.Owner)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(user.userId, dto);
  }

  @Get('mine')
  @Roles(UserRole.Owner)
  findMine(@CurrentUser() user: AuthUser) {
    return this.assignmentsService.findAllForOwner(user.userId);
  }

  @Get('open')
  @Roles(UserRole.Sitter)
  findOpen(@CurrentUser() user: AuthUser) {
    return this.assignmentsService.findOpenForSitter(user.userId);
  }
}
