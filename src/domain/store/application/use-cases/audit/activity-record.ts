import { Either, right } from "src/core/either";
import { ActivityStatus } from "src/core/entities/activity-status";
import { AuditRepository } from "../../repositories/audit-repository";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

interface ActivityRecordUseCaseRequest {
  staffId: string;
  status: ActivityStatus;
  dateTimeIso: string;
  commit: string;
}

type ActivityRecordUseCaseResponse = Either<null, object>;

export class ActivityRecordUseCase {
  constructor(private auditRepository: AuditRepository) {}

  async execute({
    staffId,
    status,
    dateTimeIso,
    commit,
  }: ActivityRecordUseCaseRequest): Promise<ActivityRecordUseCaseResponse> {
    const activityRecord = ActivityRecord.create({
      staffId: new UniqueEntityID(staffId),
      status,
      dateTimeIso,
      commit,
    });

    await this.auditRepository.createActivityRecord(activityRecord);

    return right({});
  }
}
