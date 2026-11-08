import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import type { AuthUser } from './auth-user.interface';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /** POST /api/auth/register → 201 + podatki uporabnika (brez gesla). */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** POST /api/auth/login → 200 + { accessToken, user } ali 401. */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** GET /api/auth/me → podatki prijavljenega uporabnika (zahteva JWT). */
  @Get('me')
  async me(@CurrentUser() authUser: AuthUser) {
    const user = await this.usersService.findById(authUser.userId);
    if (!user) {
      throw new UnauthorizedException('Neveljavna ali potekla prijava');
    }
    return this.usersService.toPublic(user);
  }
}
