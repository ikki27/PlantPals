import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user-role.enum';
import { UsersService } from './users.service';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) {
      return;
    }

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      return;
    }

    await this.usersService.create({
      email,
      passwordHash: await bcrypt.hash(password, 10),
      displayName: 'Administrator',
      roles: [UserRole.Admin],
    });
    this.logger.log(`Ustvarjen administratorski račun ${email}`);
  }
}
