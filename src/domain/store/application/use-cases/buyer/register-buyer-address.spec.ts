import { expect, describe, test, beforeEach } from "vitest";
import { RegisterBuyerAddressUseCase } from "./register-buyer-address";
import { InMemoryBuyerAddressRepository } from "test/repositories/in-memory-buyer-address-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeBuyerAddress } from "test/factories/make-buyer-address";
import { makeUser } from "test/factories/make-user";

let buyerAddressRepository: InMemoryBuyerAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: RegisterBuyerAddressUseCase;

describe("Buyer Address", () => {
  beforeEach(() => {
    buyerAddressRepository = new InMemoryBuyerAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new RegisterBuyerAddressUseCase(
      buyerAddressRepository,
      usersRepository,
    );
  });

  test("should be able to register buyer address", async () => {
    const user = await makeUser(
      {},
      new UniqueEntityID("register-user-test-id"),
    );

    await usersRepository.create(user);

    const buyerAddress = await makeBuyerAddress({ buyerId: user.id });

    const result = await sut.execute({
      buyerId: buyerAddress.buyerId.toString(),
      cep: buyerAddress.cep,
      city: buyerAddress.city,
      uf: buyerAddress.uf,
      street: buyerAddress.street,
      complement: buyerAddress.complement,
      houseNumber: buyerAddress.houseNumber,
      neighborhood: buyerAddress.neighborhood,
      phoneNumber: buyerAddress.phoneNumber,
      username: buyerAddress.username,
      email: buyerAddress.email,
    });

    expect(result.isRight()).toBe(true);

    expect(buyerAddressRepository.items).toHaveLength(1);
    if (result.isRight()) {
      expect(result.value.buyerAddress).toEqual(
        expect.objectContaining({
          buyerId: new UniqueEntityID("register-user-test-id"),
        }),
      );
    }
  });
});