import { Entity } from "src/core/entities/entity";
import { Role } from "src/core/entities/role";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface StaffProps {
  userId: UniqueEntityID;
  isActive: boolean;
  role: Role;
}

export class Staff extends Entity<StaffProps> {
  get userId() {
    return this.props.userId;
  }

  get isActive() {
    return this.props.isActive;
  }

  get role() {
    return this.props.role;
  }

  static create(props: StaffProps, id?: UniqueEntityID) {
    return new Staff(
      {
        ...props,
      },
      id,
    );
  }
}
