import { Optional } from "src/core/@types/optional";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface UserProps {
  publicId: UniqueEntityID;
  validationId: UniqueEntityID | null;
  username: string;
  email: string;
  password: string;
  picture: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get publicId() {
    return this.props.publicId;
  }

  get validationId() {
    return this.props.validationId;
  }

  get username() {
    return this.props.username;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get picture() {
    return this.props.picture;
  }

  get emailVerified() {
    return this.props.emailVerified;
  }

  private set emailVerified(value: boolean) {
    this.props.emailVerified = value;
    this.touch();
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

  static create(props: Optional<UserProps, "createdAt">, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }

  update(props: Partial<UserProps>): User {
    return new User(
      {
        ...this.props,
        ...props,
        updatedAt: new Date(),
      },
      this.id,
    );
  }
}
