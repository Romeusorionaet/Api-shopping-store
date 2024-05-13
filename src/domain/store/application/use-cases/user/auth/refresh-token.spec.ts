import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { InMemoryRefreshTokenRepository } from "test/repositories/in-memory-refresh-tokens-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { RefreshTokenUseCase } from "./refresh-token";
import { makeAuthenticateUserWithTokens } from "test/factories/make-create-and-authenticate-user";

let usersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let refreshTokensRepository: InMemoryRefreshTokenRepository;

let sut: RefreshTokenUseCase;

describe("Refresh Token", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    fakeHasher = new FakeHasher();

    fakeEncrypter = new FakeEncrypter();

    refreshTokensRepository = new InMemoryRefreshTokenRepository();

    sut = new RefreshTokenUseCase(refreshTokensRepository, fakeEncrypter);
  });

  test("should be able to get a refresh token", async () => {
    const user = await makeUser(
      {
        email: "firstuser@gmail.com",
        password: await fakeHasher.hash("123456"),
      },
      new UniqueEntityID("user-test-id-01"),
    );

    await usersRepository.create(user);

    await makeAuthenticateUserWithTokens(user.id.toString());

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        newRefreshToken: null,
      }),
    );
  });
});
