import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaActivityRecordMapper } from "../mappers/prisma-activity-record-mapper";
import { ActivityRecordRepository } from "src/domain/store/application/repositories/activity-record-repository";

export class PrismaActivityRecordRepository
  implements ActivityRecordRepository
{
  async createActivityRecord(data: ActivityRecord): Promise<void> {
    const activityRecord = PrismaActivityRecordMapper.toPrisma(data);

    await prisma.activityRecord.create({
      data: activityRecord,
    });
  }

  async getByEntityId(entityId: string): Promise<ActivityRecord[]> {
    const activityRecord = await prisma.activityRecord.findMany({
      where: {
        entityId,
      },
    });

    if (activityRecord.length === 0) {
      return [];
    }

    return activityRecord.map(PrismaActivityRecordMapper.toDomain);
  }
}
