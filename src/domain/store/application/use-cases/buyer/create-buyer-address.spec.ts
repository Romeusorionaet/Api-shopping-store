import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryBuyerAddressRepository } from "test/repositories/in-memory-buyer-address-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeBuyerAddress } from "test/factories/make-buyer-address";
import { makeUser } from "test/factories/make-user";
import { CreateBuyerAddressUseCase } from "./create-buyer-address";
import { AddressAlreadyExistError } from "../errors/address-already-exist-error";

let buyerAddressRepository: InMemoryBuyerAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateBuyerAddressUseCase;

describe("Create Buyer Address", () => {
  beforeEach(() => {
    buyerAddressRepository = new InMemoryBuyerAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new CreateBuyerAddressUseCase(
      buyerAddressRepository,
      usersRepository,
    );
  });

  test("should be able to create buyer address", async () => {
    const user = await makeUser(
      {},
      new UniqueEntityID("register-user-test-id"),
    );

    await usersRepository.create(user);

    const buyerAddress = makeBuyerAddress({
      buyerId: user.id,
      city: "Canguaretama",
    });

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
          city: "Canguaretama",
        }),
      );
    }
  });

  test("should not be able to create a buyer address if it already exists, and that existing address is not associated with an orderId", async () => {
    const user = await makeUser(
      {},
      new UniqueEntityID("register-user-test-id"),
    );

    await usersRepository.create(user);

    const buyerAddress = makeBuyerAddress({
      buyerId: user.id,
    });

    await buyerAddressRepository.create(buyerAddress);

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

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AddressAlreadyExistError);
  });
});
