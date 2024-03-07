import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "src/test/repositories/in-memory-users-repository";
import { MakeUser } from "src/test/factories/make-user";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { FakeHasher } from "src/test/cryptography/fake-hasher";
import { FakeEncrypter } from "src/test/cryptography/fake-encrypter";

let usersRepository: InMemoryUsersRepository;
let fakerHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    fakerHasher = new FakeHasher();

    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(
      usersRepository,
      fakerHasher,
      fakeEncrypter,
    );
  });

  test("should be able to authenticate user", async () => {
    const user = await MakeUser({
      email: "firstuser@gmail.com",
      password: await fakerHasher.hash("123456"),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      email: "firstuser@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  test("should not be able to authenticate user with wrong email", async () => {
    const user = await MakeUser({
      email: "firstuser@gmail.com",
      password: await fakerHasher.hash("123456"),
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
    const user = await MakeUser({
      email: "firstuser@gmail.com",
      password: await fakerHasher.hash("123456"),
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
