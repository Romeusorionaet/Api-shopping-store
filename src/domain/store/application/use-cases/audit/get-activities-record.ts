import { Either, right } from "src/core/either";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { ActivityRecordRepository } from "../../repositories/activity-record-repository";

interface GetActivitiesRecordUseCaseRequest {
  id: string;
}

type GetActivitiesRecordUseCaseResponse = Either<
  null,
  {
    activityRecord: ActivityRecord[];
  }
>;

export class GetActivitiesRecordUseCase {
  constructor(private activityRecordRepository: ActivityRecordRepository) {}

  async execute({
    id,
  }: GetActivitiesRecordUseCaseRequest): Promise<GetActivitiesRecordUseCaseResponse> {
    const activityRecord =
      await this.activityRecordRepository.getByEntityId(id);

    return right({ activityRecord });
  }
}
