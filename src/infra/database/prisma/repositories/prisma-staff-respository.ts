import { StaffRepository } from "src/domain/store/application/repositories/staff-repository";
import { Staff } from "src/domain/store/enterprise/entities/staff";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaStaffMapper } from "../mappers/prisma-staff-mapper";

export class PrismaStaffRepository implements StaffRepository {
  async findByUserId(id: string): Promise<Staff | null> {
    const staff = await prisma.staff.findUnique({
      where: {
        userId: id,
      },
    });

    if (!staff) {
      return null;
    }

    return PrismaStaffMapper.toDomain(staff);
  }
}
