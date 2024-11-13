import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";

export class ActivityRecordPresenter {
  static toHTTP(activityRecord: ActivityRecord) {
    return {
      id: activityRecord.id.toString(),
      commit: activityRecord.commit,
      dateTimeIso: activityRecord.dateTimeIso,
      entityType: activityRecord.entityType,
      status: activityRecord.status,
    };
  }
}
