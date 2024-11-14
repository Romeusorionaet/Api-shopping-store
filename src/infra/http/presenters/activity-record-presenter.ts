import { ActivityRecordWithStaffType } from "src/domain/store/application/repositories/activity-record-repository";

export class ActivityRecordPresenter {
  static toHTTP(item: ActivityRecordWithStaffType) {
    return {
      id: item.activityRecord.id.toString(),
      commit: item.activityRecord.commit,
      dateTimeIso: item.activityRecord.dateTimeIso,
      entityType: item.activityRecord.entityType,
      status: item.activityRecord.status,
      staff: {
        role: item.staff.role,
        user: {
          name: item.staff.user.username,
          email: item.staff.user.email,
        },
      },
    };
  }
}
