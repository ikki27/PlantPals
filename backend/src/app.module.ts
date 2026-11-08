import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';

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
  ],
})
export class AppModule {}
