import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { InMemoryRefreshTokenRepository } from "test/repositories/in-memory-refresh-tokens-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let usersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let refreshTokensRepository: InMemoryRefreshTokenRepository;

let sut: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    fakeHasher = new FakeHasher();

    fakeEncrypter = new FakeEncrypter();

    refreshTokensRepository = new InMemoryRefreshTokenRepository();

    sut = new AuthenticateUserUseCase(
      usersRepository,
      fakeHasher,
      fakeEncrypter,
      refreshTokensRepository,
    );
  });

  test("should be able to authenticate user", async () => {
    const user = await makeUser(
      {
        email: "firstuser@gmail.com",
        password: await fakeHasher.hash("123456"),
      },
      new UniqueEntityID("user-test-id-01"),
    );

    await usersRepository.create(user);

    const result = await sut.execute({
      email: "firstuser@gmail.com",
      password: "123456",
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

  test("should not be able to authenticate user with wrong email", async () => {
    const user = await makeUser({
      email: "firstuser@gmail.com",
      password: await fakeHasher.hash("123456"),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      email: "wrongemail@gmail.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  test("should not be able to authenticate with wrong password", async () => {
    const user = await makeUser({
      email: "firstuser@gmail.com",
      password: await fakeHasher.hash("123456"),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      email: "firstuser@gmail.com",
      password: "654321",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
