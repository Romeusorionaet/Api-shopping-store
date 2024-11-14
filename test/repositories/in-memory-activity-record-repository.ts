import {
  ActivityRecordRepository,
  ActivityRecordWithStaffType,
} from "src/domain/store/application/repositories/activity-record-repository";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { InMemoryStaffRepository } from "./in-memory-staff-repository";

export class InMemoryActivityRecordRepository
  implements ActivityRecordRepository
{
  public items: ActivityRecord[] = [];

  constructor(private staffRepository: InMemoryStaffRepository) {}

  async create(data: ActivityRecord): Promise<void> {
    this.items.push(data);
  }

  async getActivityRecordWithStaffByEntityId(
    entityId: string,
  ): Promise<ActivityRecordWithStaffType[]> {
    const activityRecords = this.items.filter(
      (activityRecord) => activityRecord.entityId.toString() === entityId,
    );

    if (activityRecords.length === 0) {
      return [];
    }

    const activityRecordsWithStaff = await Promise.all(
      activityRecords.map(async (activityRecord) => ({
        activityRecord,
        staff: await this.staffRepository.findByStaffId(
          activityRecord.staffId.toString(),
        ),
      })),
    );

    return activityRecordsWithStaff;
  }
}
