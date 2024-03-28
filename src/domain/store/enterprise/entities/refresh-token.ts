import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface RefreshTokenProps {
  expires: number;
  userId: UniqueEntityID;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  get expires() {
    return this.props.expires;
  }

  get userId() {
    return this.props.userId;
  }

  static create(props: RefreshTokenProps, id?: UniqueEntityID) {
    const user = new RefreshToken(
      {
        ...props,
      },
      id,
    );

    return user;
  }
}
