import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Logger } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  private logger = new Logger('AppController');

  @Get('last')
  @UseGuards(ThrottlerGuard)
  async getLastCryptoRates() {
    try {
      this.logger.log('Fetching last crypto rates from redis');
      const lastRates = await this.redisService.get('crypto_rates');
      if (!lastRates) {
        return { message: 'No data available' };
      }
      return lastRates;
    } catch (error) {
      this.logger.error('Failed to fetch last crypto rates', error.stack);
    }
  }
}
