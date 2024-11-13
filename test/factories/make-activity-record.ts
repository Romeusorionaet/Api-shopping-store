import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  ActivityRecord,
  ActivityRecordProps,
} from "src/domain/store/enterprise/entities/activity-record";
import { ActivityStatus } from "src/core/entities/activity-status";
import { EntityType } from "src/core/entities/entity-type";
import { PrismaActivityRecordMapper } from "src/infra/database/prisma/mappers/prisma-activity-record-mapper";

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

    await prisma.category.create({
      data: PrismaActivityRecordMapper.toPrisma(activityRecord),
    });

    return activityRecord;
  }
}
