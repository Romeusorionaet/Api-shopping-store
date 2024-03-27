import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface UserAddressProps {
  userId: UniqueEntityID;
  cep: number;
  city: string;
  uf: string;
  street: string;
  neighborhood: string;
  houseNumber: number;
  complement: string;
  phoneNumber: number;
  username: string;
  email: string;
}

export class UserAddress extends Entity<UserAddressProps> {
  get userId() {
    return this.props.userId;
  }

  get cep() {
    return this.props.cep;
  }

  get city() {
    return this.props.city;
  }

  get uf() {
    return this.props.uf;
  }

  get street() {
    return this.props.street;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  get houseNumber() {
    return this.props.houseNumber;
  }

  get complement() {
    return this.props.complement;
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  get username() {
    return this.props.username;
  }

  get email() {
    return this.props.email;
  }

  set username(name: string) {
    this.props.username = name;
  }

  static create(props: UserAddressProps, id?: UniqueEntityID) {
    const buyerAddress = new UserAddress(
      {
        ...props,
      },
      id,
    );

    return buyerAddress;
  }

  update(props: Partial<UserAddressProps>): UserAddress {
    return new UserAddress(
      {
        ...this.props,
        ...props,
      },
      this.id,
    );
  }
}
