import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryBuyerAddressRepository } from "src/test/repositories/in-memory-buyer-address-repository";
import { MakeUser } from "src/test/factories/make-user";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { MakeBuyerAddress } from "src/test/factories/make-buyer-address";
import { GetBuyerAddressUseCase } from "./get-buyer-address";
import { InMemoryUsersRepository } from "src/test/repositories/in-memory-users-repository";

let buyerAddressRepository: InMemoryBuyerAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetBuyerAddressUseCase;

describe("Get Address", () => {
  beforeEach(() => {
    buyerAddressRepository = new InMemoryBuyerAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new GetBuyerAddressUseCase(buyerAddressRepository);
  });

  test("should be able to get buyer address by id", async () => {
    const user = await MakeUser({}, new UniqueEntityID("user-test-id"));

    await usersRepository.create(user);

    const buyerAddress = await MakeBuyerAddress({ buyerId: user.id });

    await buyerAddressRepository.create(buyerAddress);

    const result = await sut.execute({
      buyerAddressId: buyerAddress.buyerId.toString(),
    });

    expect(result.isRight()).toBe(true);

    expect(buyerAddressRepository.items).toHaveLength(1);

    if (result.isRight()) {
      expect(result.value.buyerAddress).toEqual(
        expect.objectContaining({
          buyerId: new UniqueEntityID("user-test-id"),
        }),
      );
    }
  });
});
