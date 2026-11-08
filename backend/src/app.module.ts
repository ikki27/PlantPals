import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { HealthModule } from './health/health.module';
import { PlantsModule } from './plants/plants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Naloži spremenljivke iz backend/.env in jih naredi dostopne povsod.
    ConfigModule.forRoot({ isGlobal: true }),

    // Povezava z MongoDB; URI pride iz .env (MONGO_URI).
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI'),
      }),
    }),

    HealthModule,
    UsersModule,
    AuthModule,
    PlantsModule,
  ],
  providers: [
    // Vse končne točke so privzeto zaščitene z JWT (izjeme označimo z @Public()).
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
