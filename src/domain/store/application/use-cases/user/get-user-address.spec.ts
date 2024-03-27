import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeUser } from "test/factories/make-user";
import { makeUserAddress } from "test/factories/make-user-address";
import { GetUserAddressUseCase } from "./get-user-address";
import { InMemoryUsersAddressRepository } from "test/repositories/in-memory-users-address-repository";

let userAddressRepository: InMemoryUsersAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetUserAddressUseCase;

describe("Create User Address", () => {
  beforeEach(() => {
    userAddressRepository = new InMemoryUsersAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new GetUserAddressUseCase(userAddressRepository);
  });

  test("should be able to create user address", async () => {
    const user = await makeUser(
      {},
      new UniqueEntityID("register-user-test-id"),
    );

    await usersRepository.create(user);

    const buyerAddress = makeUserAddress({
      userId: user.id,
      city: "Canguaretama",
    });

    await userAddressRepository.create(buyerAddress);

    const result = await sut.execute({ userId: user.id.toString() });

    expect(result.isRight()).toBe(true);

    expect(userAddressRepository.items).toHaveLength(1);

    if (result.isRight()) {
      expect(result.value.userAddress).toEqual(
        expect.objectContaining({
          userId: new UniqueEntityID("register-user-test-id"),
          city: "Canguaretama",
        }),
      );
    }
  });
});
