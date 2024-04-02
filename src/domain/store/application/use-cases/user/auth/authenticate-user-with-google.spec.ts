import { expect, describe, test, beforeEach } from "vitest";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeUser } from "test/factories/make-user";
import { InMemoryRefreshTokenRepository } from "test/repositories/in-memory-refresh-tokens-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { AuthenticateUserWithGoogleUseCase } from "./authenticate-user-with-google";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;
let usersRepository: InMemoryUsersRepository;
let refreshTokensRepository: InMemoryRefreshTokenRepository;

let sut: AuthenticateUserWithGoogleUseCase;

describe("Authenticate User With Google", () => {
  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter();

    fakeHasher = new FakeHasher();

    usersRepository = new InMemoryUsersRepository();

    refreshTokensRepository = new InMemoryRefreshTokenRepository();

    sut = new AuthenticateUserWithGoogleUseCase(
      fakeEncrypter,
      refreshTokensRepository,
    );
  });

  test("should be able to authenticate user with google", async () => {
    const user = await makeUser(
      {
        email: "firstuser@gmail.com",
        password: await fakeHasher.hash("123456"),
      },
      new UniqueEntityID("user-test-id-01"),
    );

    await usersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.objectContaining({
        id: expect.any(UniqueEntityID),
        userId: new UniqueEntityID("user-test-id-01"),
        expires: expect.any(Number),
      }),
    });
  });
});
