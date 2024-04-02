import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { RegisterUserWithGoogleUseCase } from "./register-user-with-google";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserWithGoogleUseCase;

describe("Register User With Google", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    sut = new RegisterUserWithGoogleUseCase(usersRepository);
  });

  test("should be able to register user with google", async () => {
    const result = await sut.execute({
      username: "first user",
      email: "firstuser@gmail.com",
    });

    if (result.user) {
      expect(result.user).toEqual(
        expect.objectContaining({
          username: "first user",
          email: "firstuser@gmail.com",
        }),
      );
    }
  });
});
