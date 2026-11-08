import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { AssignmentsService } from './assignments.service';
import { AssignSitterDto } from './dto/assign-sitter.dto';
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

  @Get('sitting')
  @Roles(UserRole.Sitter)
  findSitting(@CurrentUser() user: AuthUser) {
    return this.assignmentsService.findAllForSitter(user.userId);
  }

  @Post(':id/apply')
  @Roles(UserRole.Sitter)
  @HttpCode(HttpStatus.OK)
  apply(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.assignmentsService.apply(id, user.userId);
  }

  @Get(':id/applicants')
  @Roles(UserRole.Owner)
  findApplicants(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.assignmentsService.findApplicants(id, user.userId);
  }

  @Post(':id/assign')
  @Roles(UserRole.Owner)
  @HttpCode(HttpStatus.OK)
  assign(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: AssignSitterDto,
  ) {
    return this.assignmentsService.assignSitter(id, user.userId, dto.sitterId);
  }

  @Post(':id/start')
  @Roles(UserRole.Sitter)
  @HttpCode(HttpStatus.OK)
  start(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.assignmentsService.startCare(id, user.userId);
  }

  @Post(':id/return')
  @Roles(UserRole.Sitter)
  @HttpCode(HttpStatus.OK)
  returnCare(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.assignmentsService.returnCare(id, user.userId);
  }

  @Post(':id/confirm')
  @Roles(UserRole.Owner)
  @HttpCode(HttpStatus.OK)
  confirm(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.assignmentsService.confirmReturn(id, user.userId);
  }

  @Get(':id')
  @Roles(UserRole.Owner, UserRole.Sitter)
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.assignmentsService.findOneForParticipant(id, user.userId);
  }
}
