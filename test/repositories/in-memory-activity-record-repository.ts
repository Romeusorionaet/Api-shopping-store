import { ActivityRecordRepository } from "src/domain/store/application/repositories/activity-record-repository";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";

export class InMemoryActivityRecordRepository
  implements ActivityRecordRepository
{
  public items: ActivityRecord[] = [];
  async create(data: ActivityRecord): Promise<void> {
    this.items.push(data);
  }

  async getByEntityId(entityId: string): Promise<ActivityRecord[]> {
    const activityRecords = this.items.filter(
      (activityRecord) => activityRecord.entityId.toString() === entityId,
    );

    if (activityRecords.length === 0) {
      return [];
    }

    return activityRecords;
  }
}
