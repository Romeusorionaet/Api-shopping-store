import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryUsersAddressRepository } from "test/repositories/in-memory-users-address-repository";
import { UpdateUserAddressUseCase } from "./update-user-address";
import { makeUserAddress } from "test/factories/make-user-address";

let userAddressRepository: InMemoryUsersAddressRepository;
let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserAddressUseCase;

describe("Update user address", () => {
  beforeEach(() => {
    userAddressRepository = new InMemoryUsersAddressRepository();

    usersRepository = new InMemoryUsersRepository();

    sut = new UpdateUserAddressUseCase(userAddressRepository);
  });

  test("should be able to update user address", async () => {
    const user = await makeUser();
    await usersRepository.create(user);

    const userAddress = makeUserAddress(
      { userId: user.id },
      new UniqueEntityID("address id 123"),
    );

    userAddressRepository.items.push(userAddress);

    const result = await sut.execute({
      userId: user.id.toString(),
      cep: 12345678,
      city: "new city",
      uf: "ab",
      street: "new street",
      neighborhood: "new neighborhood",
      houseNumber: 123,
      complement: "new complement",
      phoneNumber: "84981127596",
      username: "new username",
      email: "new email",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.userAddressUpdated).toEqual(
        expect.objectContaining({
          id: new UniqueEntityID("address id 123"),
          cep: 12345678,
          city: "new city",
          uf: "ab",
          street: "new street",
          neighborhood: "new neighborhood",
          houseNumber: 123,
          complement: "new complement",
          phoneNumber: "84981127596",
          username: "new username",
          email: "new email",
        }),
      );
    }
  });
});
