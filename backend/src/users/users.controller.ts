import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AddRoleDto } from './dto/add-role.dto';
import { UserRole } from './user-role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.Admin)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => this.usersService.toPublic(user));
  }

  @Post('me/roles')
  async addRole(@CurrentUser() authUser: AuthUser, @Body() dto: AddRoleDto) {
    const user = await this.usersService.addRole(authUser.userId, dto.role);
    if (!user) {
      throw new NotFoundException('Uporabnik ne obstaja');
    }
    return this.usersService.toPublic(user);
  }
}
