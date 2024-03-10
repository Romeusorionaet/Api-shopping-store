import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetBuyerProfileUseCase } from "./get-buyer-profile";
import { MakeUser } from "test/factories/make-user";

let usersRepository: InMemoryUsersRepository;
let sut: GetBuyerProfileUseCase;

describe("Get Buyer Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetBuyerProfileUseCase(usersRepository);
  });

  test("should be able to get Buyer profile", async () => {
    const user = await MakeUser({ username: "user example" });

    await usersRepository.create(user);

    const result = await sut.execute({ buyerId: user.id.toString() });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.buyer.username).toEqual("user example");
    }
  });

  test("should not be able to get uer profile with wrong id", async () => {
    const user = await MakeUser();

    await usersRepository.create(user);

    const result = await sut.execute({ buyerId: "wrong-id" });

    expect(result.isLeft()).toBe(true);
  });
});
