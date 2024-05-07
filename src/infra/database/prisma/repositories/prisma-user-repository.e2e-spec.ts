import { app } from "src/app";
import { PrismaUserRepository } from "./prisma-user-repository";
import { RedisCacheRepository } from "src/infra/cache/redis/redis-cache-repository";
import { RedisService } from "src/infra/cache/redis/redis-service";
import { UserFactory } from "test/factories/make-user";
import { prisma } from "../prisma";

describe("Prisma Users Repository (E2E)", () => {
  let usersRepository: PrismaUserRepository;
  let redisCacheRepository: RedisCacheRepository;
  let redis: RedisService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    await app.ready();

    userFactory = new UserFactory();

    redis = new RedisService();

    redisCacheRepository = new RedisCacheRepository(redis);

    usersRepository = new PrismaUserRepository(redisCacheRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  test("should cache user profile", async () => {
    const user = await userFactory.makePrismaUser();

    const id = user.id.toString();

    await usersRepository.findById(id); // for save in cache

    const userProfileOnDatabase = await prisma.user.findUnique({
      where: { id },
    });

    const cached = await redisCacheRepository.get(`user:${id}:profile`);

    expect(cached).toEqual(JSON.stringify(userProfileOnDatabase));
  });

  test("should return cached user profile on subsequent calls", async () => {
    const user = await userFactory.makePrismaUser();

    const id = user.id.toString();

    await redisCacheRepository.set(
      `user:${id}:profile`,
      JSON.stringify({ empty: true }),
    );

    const userProfileOnDatabase = await prisma.user.findUnique({
      where: { id },
    });

    expect(userProfileOnDatabase?.id).toEqual(id);
  });
});
// mudar de user para product ou category para utilizar nesse test, ainda falata mais um teste a fazer.
