import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from './redis.service';
import { CryptoGateway } from './crypto.gateway';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * AppService provides functionalities to fetch cryptocurrency rates
 * and broadcast updates through WebSocket.
 */
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  /**
   * Constructs the AppService with necessary services.
   *
   * @param configService - The configuration service for accessing environment variables.
   * @param redisService - The Redis service for caching data.
   * @param cryptoGateway - The WebSocket gateway for broadcasting updates.
   */
  constructor(
    private configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly cryptoGateway: CryptoGateway,
  ) {}

  /**
   * Fetches cryptocurrency rates every 10 minutes and stores them in Redis.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async fetchAndStoreCryptoRates() {
    this.logger.log('Fetching crypto rates at:' + new Date());

    try {
      const response = await axios.get(
        `http://api.coinlayer.com/api/live?access_key=${this.configService.get('COINLAYER_API_KEY')}&target=EUR&expand=1`,
      );
      const data = response.data; // Extract the data from Coinlayer's response

      if (!data.success) {
        this.logger.error('Failed to fetch data from Coinlayer API');
        return;
      }

      const last_update = new Date(data.timestamp * 1000).toISOString();
      const storeData = {
        last_update,
        rates: data.rates,
      };

      await this.redisService.set('crypto_rates', storeData);
      this.logger.log('Crypto rates updated and stored in Redis');
      await this.cryptoGateway.broadcastUpdateSignal();
      // await this.cryptoGateway.broadcastUpdatedCryptoData(); -> THIS IS IF WANT TO RETURN THE DATA INSEAD OF PING MSG
      this.logger.log('Crypto rates broadcasted to connected clients');
    } catch (error) {
      this.logger.error('Failed to fetch and store crypto rates', error.stack);
    }
  }
}
