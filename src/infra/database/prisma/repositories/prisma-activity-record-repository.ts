import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import {
  ActivityRecordRepository,
  ActivityRecordWithStaffType,
} from "src/domain/store/application/repositories/activity-record-repository";
import { PrismaActivityRecordMapper } from "../mappers/prisma-activity-record-mapper";
import { CacheRepository } from "src/infra/cache/cache-repository";
import { CacheKeysPrefix } from "src/core/constants/cache-keys-prefix";

export class PrismaActivityRecordRepository
  implements ActivityRecordRepository
{
  constructor(private cacheRepository: CacheRepository) {}

  async create(data: ActivityRecord): Promise<void> {
    const activityRecord = PrismaActivityRecordMapper.toPrisma(data);

    await prisma.activityRecord.create({
      data: activityRecord,
    });

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.ACTIVITY_RECORD}:*`,
    );
  }

  async getActivityRecordWithStaffByEntityId(
    entityId: string,
  ): Promise<ActivityRecordWithStaffType[]> {
    const cacheKey = `${CacheKeysPrefix.ACTIVITY_RECORD}:${entityId}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaActivityRecordMapper.toDomain);
    }

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

    const productMapped = activityRecord.map(
      PrismaActivityRecordMapper.toDomain,
    );

    await this.cacheRepository.set(cacheKey, JSON.stringify(activityRecord));

    return productMapped;
  }
}
