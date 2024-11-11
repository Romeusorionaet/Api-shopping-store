import { Prisma, Staff as PrismaStaff } from "@prisma/client";
import { Role } from "src/core/entities/role";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Staff } from "src/domain/store/enterprise/entities/staff";

export class PrismaStaffMapper {
  static toDomain(raw: PrismaStaff): Staff {
    const role: Role = raw.role as Role;

    return Staff.create(
      {
        userId: new UniqueEntityID(raw.userId),
        isActive: raw.isActive,
        role,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(staff: Staff): Prisma.StaffUncheckedCreateInput {
    return {
      id: staff.id.toString(),
      userId: staff.userId.toString(),
      role: staff.role,
      isActive: staff.isActive,
    };
  }
}
