import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ConfirmEmailUseCase } from "./confirm-email";

let usersRepository: InMemoryUsersRepository;

let sut: ConfirmEmailUseCase;

describe("Confirm email", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    sut = new ConfirmEmailUseCase(usersRepository);
  });

  test("should be able to confirm email", async () => {
    const user = await makeUser(
      {
        email: "firstuser@gmail.com",
      },
      new UniqueEntityID("user-test-id-01"),
    );

    await usersRepository.create(user);

    const result = await sut.execute({ token: user.validationId!.toString() });

    expect(result.isRight()).toBe(true);

    expect(usersRepository.items[0]).toEqual(
      expect.objectContaining({ emailVerified: true, validationId: null }),
    );
  });
});
