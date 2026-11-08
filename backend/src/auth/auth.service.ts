import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PublicUser, UsersService } from '../users/users.service';
import { JwtPayload } from './auth-user.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 10;
const EMAIL_TAKEN = 'E-naslov je že v uporabi';
const INVALID_CREDENTIALS = 'Napačni podatki za prijavo';

export interface LoginResult {
  accessToken: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * US-02: registracija novega uporabnika.
   * - zavrne že uporabljen e-naslov (409)
   * - geslo shrani izključno kot bcrypt hash
   */
  async register(dto: RegisterDto): Promise<PublicUser> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(EMAIL_TAKEN);
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const user = await this.usersService.create({
        email: dto.email,
        passwordHash,
        displayName: dto.displayName.trim(),
        roles: [dto.role],
      });
      return this.usersService.toPublic(user);
    } catch (err) {
      // Dve sočasni registraciji z istim e-naslovom: unikatni indeks v MongoDB vrne kodo 11000.
      if ((err as { code?: number }).code === 11000) {
        throw new ConflictException(EMAIL_TAKEN);
      }
      throw err;
    }
  }

  /**
   * US-03: prijava z e-naslovom in geslom.
   * - ob uspehu vrne podpisan JWT in javne podatke uporabnika
   * - ob napačnem e-naslovu ALI geslu vrne isto sporočilo (401),
   *   da ne razkrijemo, katero polje je napačno
   */
  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.usersService.findByEmail(dto.email);
    const passwordOk = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : false;

    if (!user || !passwordOk) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const payload: JwtPayload = {
      sub: user.id as string,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.usersService.toPublic(user),
    };
  }
}
