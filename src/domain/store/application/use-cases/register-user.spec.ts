import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { MakeUser } from "test/factories/make-user";
import { RegisterUserUseCase } from "./register-user";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

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
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
