import { Either, right } from "src/core/either";
import { ActivityStatus } from "src/core/entities/activity-status";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { EntityType } from "src/core/entities/entity-type";
import { ActivityRecordRepository } from "../../repositories/activity-record-repository";

interface CreateActivityRecordUseCaseRequest {
  staffId: string;
  entityId: string;
  entityType: EntityType;
  status: ActivityStatus;
  dateTimeIso: string;
  commit: string;
}

type CreateActivityRecordUseCaseResponse = Either<null, object>;

export class CreateActivityRecordUseCase {
  constructor(private activityRecordRepository: ActivityRecordRepository) {}

  async execute({
    staffId,
    entityId,
    entityType,
    status,
    dateTimeIso,
    commit,
  }: CreateActivityRecordUseCaseRequest): Promise<CreateActivityRecordUseCaseResponse> {
    const activityRecord = ActivityRecord.create({
      staffId: new UniqueEntityID(staffId),
      entityId: new UniqueEntityID(entityId),
      entityType,
      status,
      dateTimeIso,
      commit,
    });

    await this.activityRecordRepository.create(activityRecord);

    return right({});
  }
}
