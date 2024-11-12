import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CryptoGateway } from './crypto.gateway';

/**
 * AppModule is the main module of the application, configuring global settings,
 * imports, controllers, and providers.
 */
@Module({
  imports: [
    // Configuration module for handling environment variables and configuration settings.
    ConfigModule.forRoot({ isGlobal: true }),
    // Scheduling module for handling cron jobs and task scheduling.
    ScheduleModule.forRoot(),
    // Throttling module for rate limiting requests to protect against brute force attacks.
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 60, // Time to live (seconds) for rate limiting
        limit: 30, // Maximum number of requests within the TTL period
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService, // Application-wide services
    RedisService, // Redis service for cache and data management
    {
      provide: 'APP_GUARD', // Application guard for enabling throttler guard globally
      useClass: ThrottlerGuard,
    },
    CryptoGateway, // WebSocket gateway for handling real-time data with WebSockets
  ],
})
export class AppModule {}
