import { expect, describe, test, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryUsersRepository } from "src/test/repositories/in-memory-users-repository";
import { MakeUser } from "src/test/factories/make-user";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  test("should be able to authenticate", async () => {
    const user = await MakeUser({
      email: "firstuser@gmail.com",
      password: await hash("123456", 6),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      email: "firstuser@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.user).toEqual(
        expect.objectContaining({
          email: "firstuser@gmail.com",
        }),
      );
    }
  });

  test("should not be able to authenticate with wrong email", async () => {
    const user = await MakeUser({
      email: "firstuser@gmail.com",
      password: await hash("123456", 6),
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
      password: await hash("123456", 6),
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
