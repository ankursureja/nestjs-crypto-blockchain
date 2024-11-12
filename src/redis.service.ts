import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

/**
 * Service for interacting with Redis, providing methods for setting, getting, and incrementing values.
 */
@Injectable()
export class RedisService {
  redis: Redis;

  /**
   * Initializes the Redis client with configuration from the ConfigService.
   *
   * @param configService - The ConfigService to access environment variables.
   */
  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      url: this.configService.get('UPSTASH_REDIS_REST_URL'),
      token: this.configService.get('UPSTASH_REDIS_REST_TOKEN'),
    });
  }

  /**
   * Sets a value in Redis.
   *
   * @param key - The key under which to store the value.
   * @param value - The value to store.
   * @returns A promise resolving to the result of the Redis set operation.
   */
  async set(key: string, value: any) {
    return await this.redis.set(key, value);
  }

  /**
   * Retrieves a value from Redis.
   *
   * @param key - The key of the value to retrieve.
   * @returns A promise resolving to the value, or null if not found.
   */
  async get(key: string): Promise<any | null> {
    return await this.redis.get(key);
  }
}
