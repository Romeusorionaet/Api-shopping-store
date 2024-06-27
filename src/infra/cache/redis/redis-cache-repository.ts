import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { CacheRepository } from "../cache-repository";
import { CacheTimeInMinutes } from "src/core/constants/cache-time-in-minutes";

export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string, minutes?: number): Promise<void> {
    const time = minutes ?? CacheTimeInMinutes.default;
    await this.redis.set(key, value, "EX", 60 * time);
  }

  async get(key: string): Promise<string | null> {
    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    return data;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deleteCacheByPattern(pattern: string): Promise<void> {
    const keysToDelete = await this.redis.keys(pattern);
    for (const key of keysToDelete) {
      await this.redis.del(key);
    }
  }
}
