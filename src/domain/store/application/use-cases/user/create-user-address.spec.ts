import { expect, describe, test, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeUser } from "test/factories/make-user";
import { CreateUserAddressUseCase } from "./create-user-address";
import { makeUserAddress } from "test/factories/make-user-address";
import { AddressAlreadyExistError } from "../errors/address-already-exist-error";
import { InMemoryUsersAddressRepository } from "test/repositories/in-memory-users-address-repository";

let userAddressRepository: InMemoryUsersAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateUserAddressUseCase;

describe("Create User Address", () => {
  beforeEach(() => {
    userAddressRepository = new InMemoryUsersAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new CreateUserAddressUseCase(userAddressRepository, usersRepository);
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

    const result = await sut.execute({
      userId: buyerAddress.userId.toString(),
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

  test("should not be able to create a user address if it already exists", async () => {
    const user = await makeUser(
      {},
      new UniqueEntityID("register-user-test-id"),
    );

    await usersRepository.create(user);

    const buyerAddress = makeUserAddress({
      userId: user.id,
    });

    await userAddressRepository.create(buyerAddress);

    const result = await sut.execute({
      userId: buyerAddress.userId.toString(),
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
