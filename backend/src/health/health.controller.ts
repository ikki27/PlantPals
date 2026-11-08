import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { Public } from '../auth/decorators/public.decorator';

/**
 * GET /api/health — preprosto preverjanje, ali API teče in je povezan z bazo.
 * Javna končna točka (brez JWT).
 */
@Public()
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    const dbConnected =
      this.connection.readyState === ConnectionStates.connected;

    return {
      status: 'ok',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
