import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import {
  ActivityRecordRepository,
  ActivityRecordWithStaffType,
} from "src/domain/store/application/repositories/activity-record-repository";
import { PrismaActivityRecordMapper } from "../mappers/prisma-activity-record-mapper";

export class PrismaActivityRecordRepository
  implements ActivityRecordRepository
{
  async create(data: ActivityRecord): Promise<void> {
    const activityRecord = PrismaActivityRecordMapper.toPrisma(data);

    await prisma.activityRecord.create({
      data: activityRecord,
    });
  }

  async getActivityRecordWithStaffByEntityId(
    entityId: string,
  ): Promise<ActivityRecordWithStaffType[]> {
    const activityRecord = await prisma.activityRecord.findMany({
      where: {
        entityId,
      },
      include: {
        staff: {
          select: {
            role: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (activityRecord.length === 0) {
      return [];
    }

    return activityRecord.map(PrismaActivityRecordMapper.toDomain);
  }
}
