import { PrismaStaffMapper } from "src/infra/database/prisma/mappers/prisma-staff-mapper";
import { Staff, StaffProps } from "src/domain/store/enterprise/entities/staff";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { Role } from "src/core/entities/role";

export function makeStaff(
  override: Partial<StaffProps> = {},
  id?: UniqueEntityID,
) {
  const staff = Staff.create(
    {
      userId: new UniqueEntityID(),
      isActive: true,
      role: Role.ADMIN,
      ...override,
    },
    id,
  );

  return staff;
}

export class StaffFactory {
  async makePrismaStaff(data: Partial<StaffProps> = {}): Promise<Staff> {
    const staff = makeStaff(data);

    await prisma.staff.create({
      data: PrismaStaffMapper.toPrisma(staff),
    });

    return staff;
  }
}
