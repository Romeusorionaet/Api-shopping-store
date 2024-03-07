import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "src/test/repositories/in-memory-users-repository";
import { MakeUser } from "src/test/factories/make-user";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error";
import { RegisterUserUseCase } from "./register-user";
import { FakeHasher } from "src/test/cryptography/fake-hasher";

let usersRepository: InMemoryUsersRepository;
let fakerHasher: FakeHasher;
let sut: RegisterUserUseCase;

describe("Register User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    fakerHasher = new FakeHasher();

    sut = new RegisterUserUseCase(usersRepository, fakerHasher);
  });

  test("should be able to register user", async () => {
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

    const isPasswordCorrectlyHashed = await fakerHasher.compare(
      "123456",
      user.password,
    );
    console.log(isPasswordCorrectlyHashed, "=====");

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
