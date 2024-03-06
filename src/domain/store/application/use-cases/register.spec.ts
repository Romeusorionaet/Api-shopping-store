import { expect, describe, test, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "src/test/repositories/in-memory-users-repository";
import { MakeUser } from "src/test/factories/make-user";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  test("should be able to register", async () => {
    const result = await sut.execute({
      username: "first user",
      email: "firstuser@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.user).toEqual(
        expect.objectContaining({
          username: "first user",
          email: "firstuser@gmail.com",
        }),
      );
    }
  });

  test("should hash user password upon registration", async () => {
    const user = await MakeUser();

    const isPasswordCorrectlyHashed = await compare("123456", user.password);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  test("should not be able register with same email twice", async () => {
    await sut.execute({
      username: "first user",
      email: "firstuser@gmail.com",
      password: "123456",
    });

    const result = await sut.execute({
      username: "first user",
      email: "firstuser@gmail.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError);
  });
});
