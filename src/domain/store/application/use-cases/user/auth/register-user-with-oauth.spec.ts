import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { RegisterUserWithOAuthUseCase } from "./register-user-with-oauth";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserWithOAuthUseCase;

describe("Register User With Google", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    sut = new RegisterUserWithOAuthUseCase(usersRepository);
  });

  test("should be able to register user with google", async () => {
    const result = await sut.execute({
      username: "first user",
      email: "firstuser@gmail.com",
      picture: "http://faker_picture.com",
      emailVerified: false,
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
