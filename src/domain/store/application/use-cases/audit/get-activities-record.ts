import { Either, right } from "src/core/either";
import {
  ActivityRecordRepository,
  ActivityRecordWithStaffType,
} from "../../repositories/activity-record-repository";

interface GetActivitiesRecordUseCaseRequest {
  id: string;
}

type GetActivitiesRecordUseCaseResponse = Either<
  null,
  {
    activityRecordWithStaff: ActivityRecordWithStaffType[];
  }
>;

export class GetActivitiesRecordUseCase {
  constructor(private activityRecordRepository: ActivityRecordRepository) {}

  async execute({
    id,
  }: GetActivitiesRecordUseCaseRequest): Promise<GetActivitiesRecordUseCaseResponse> {
    const activityRecordWithStaff =
      await this.activityRecordRepository.getActivityRecordWithStaffByEntityId(
        id,
      );

    return right({ activityRecordWithStaff });
  }
}
