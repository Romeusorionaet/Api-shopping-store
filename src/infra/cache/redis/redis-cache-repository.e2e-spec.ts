import { app } from "src/infra/app";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/service/setup-cache/redis-service";

describe("Prisma Users Repository (E2E)", () => {
  let redisCacheRepository: RedisCacheRepository;
  let redis: RedisService;

  beforeAll(async () => {
    await app.ready();

    redis = new RedisService();

    redisCacheRepository = new RedisCacheRepository(redis);
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able set and get a cache", async () => {
    await redisCacheRepository.set("keyTest01", "any value 01");

    const cache = await redisCacheRepository.get("keyTest01");

    expect(cache).toEqual("any value 01");
  });

  test("should be able delete a cache", async () => {
    await redisCacheRepository.set("keyTest02", "any value 02");

    await redisCacheRepository.delete("keyTest02");

    const cache = await redisCacheRepository.get("keyTest02");

    expect(cache).toEqual(null);
  });

  test("should be able delete delete cache by pattern", async () => {
    await redisCacheRepository.set("keyPrefix:01", "any value 01");

    await redisCacheRepository.set("keyPrefix:02", "any value 02");

    await redisCacheRepository.deleteCacheByPattern("keyPrefix:*");

    const cache1 = await redisCacheRepository.get("keyPrefix:01");
    const cache2 = await redisCacheRepository.get("keyPrefix:02");

    expect(cache1).toEqual(null);
    expect(cache2).toEqual(null);
  });
});
