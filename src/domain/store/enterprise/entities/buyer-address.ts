import { Optional } from "src/core/@types/optional";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface BuyerAddressProps {
  buyerId: UniqueEntityID;
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
  createdAt: Date;
  updatedAt?: Date;
}

export class BuyerAddress extends Entity<BuyerAddressProps> {
  get buyerId() {
    return this.props.buyerId;
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set username(name: string) {
    this.props.username = name;
    this.touch();
  }

  static create(
    props: Optional<BuyerAddressProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const buyerAddress = new BuyerAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return buyerAddress;
  }
}