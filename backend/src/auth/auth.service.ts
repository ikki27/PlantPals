import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PublicUser, UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 10;
const EMAIL_TAKEN = 'E-naslov je že v uporabi';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
