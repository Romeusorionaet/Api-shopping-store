import { RedisService } from "src/infra/service/setup-cache/redis-service";
import { CacheRepository } from "../cache-repository";

export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, "EX", 60 * 30); // 30minutes
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
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
