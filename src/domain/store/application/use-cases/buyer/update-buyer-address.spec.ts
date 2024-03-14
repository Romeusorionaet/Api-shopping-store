import { expect, describe, test, beforeEach } from "vitest";
import { UpdateBuyerAddressUseCase } from "./update-buyer-address";
import { InMemoryBuyerAddressRepository } from "test/repositories/in-memory-buyer-address-repository";
import { makeBuyerAddress } from "test/factories/make-buyer-address";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let buyerAddressRepository: InMemoryBuyerAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: UpdateBuyerAddressUseCase;

describe("Register User", () => {
  beforeEach(() => {
    buyerAddressRepository = new InMemoryBuyerAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new UpdateBuyerAddressUseCase(buyerAddressRepository);
  });

  test("should be able to update buyer address", async () => {
    const user = await makeUser();
    await usersRepository.create(user);

    const buyerAddress = await makeBuyerAddress(
      { buyerId: user.id },
      new UniqueEntityID("address id 123"),
    );
    await buyerAddressRepository.create(buyerAddress);

    const result = await sut.execute({
      addressId: buyerAddress.id.toString(),
      cep: 12345678,
      city: "new city",
      uf: "ab",
      street: "new street",
      neighborhood: "new neighborhood",
      houseNumber: 123,
      complement: "new complement",
      phoneNumber: 12345678,
      username: "new username",
      email: "new email",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      console.log(result.value.buyerAddressUpdated);
      expect(result.value.buyerAddressUpdated).toEqual(
        expect.objectContaining({
          id: new UniqueEntityID("address id 123"),
          cep: 12345678,
          city: "new city",
          uf: "ab",
          street: "new street",
          neighborhood: "new neighborhood",
          houseNumber: 123,
          complement: "new complement",
          phoneNumber: 12345678,
          username: "new username",
          email: "new email",
        }),
      );
    }
  });
});