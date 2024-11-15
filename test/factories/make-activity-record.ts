import {
  ActivityRecord,
  ActivityRecordProps,
} from "src/domain/store/enterprise/entities/activity-record";
import { PrismaActivityRecordMapper } from "src/infra/database/prisma/mappers/prisma-activity-record-mapper";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ActivityStatus } from "src/core/entities/activity-status";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { EntityType } from "src/core/entities/entity-type";
import { faker } from "@faker-js/faker";

export function makeActivityRecord(
  override: Partial<ActivityRecordProps> = {},
  id?: UniqueEntityID,
) {
  const activityRecord = ActivityRecord.create(
    {
      staffId: new UniqueEntityID(),
      entityId: new UniqueEntityID(),
      entityType: EntityType.CATEGORY,
      dateTimeIso: new Date().toISOString(),
      status: ActivityStatus.CREATED,
      commit: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return activityRecord;
}

export class ActivityRecordFactory {
  async makePrismaActivityRecord(
    data: Partial<ActivityRecordProps> = {},
  ): Promise<ActivityRecord> {
    const activityRecord = makeActivityRecord(data);

    await prisma.activityRecord.create({
      data: PrismaActivityRecordMapper.toPrisma(activityRecord),
    });

    return activityRecord;
  }
}
