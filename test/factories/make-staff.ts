import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Staff, StaffProps } from "src/domain/store/enterprise/entities/staff";
import { Role } from "src/core/entities/role";

export function makeStaff(
  override: Partial<StaffProps> = {},
  id?: UniqueEntityID,
) {
  const activityRecord = Staff.create(
    {
      userId: new UniqueEntityID(),
      isActive: true,
      role: Role.ADMIN,
      ...override,
    },
    id,
  );

  return activityRecord;
}
