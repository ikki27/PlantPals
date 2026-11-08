import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Vse končne točke so pod /api (npr. /api/health, kasneje /api/auth/login).
  app.setGlobalPrefix('api');

  // Dovoli klice iz React SPA (Vite dev strežnik).
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:5173'),
  });

  // Globalna validacija DTO-jev s class-validator.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`PlantPals API teče na http://localhost:${port}/api`);
}

void bootstrap();
