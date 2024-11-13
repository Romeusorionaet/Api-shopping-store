import { Either, right } from "src/core/either";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { AuditRepository } from "../../repositories/audit-repository";

interface GetCategoryActivitiesRecordUseCaseRequest {
  id: string;
}

type GetCategoryActivitiesRecordUseCaseResponse = Either<
  null,
  {
    categoryActivityRecord: ActivityRecord[];
  }
>;

export class GetCategoryActivitiesRecordUseCase {
  constructor(private auditRepository: AuditRepository) {}

  async execute({
    id,
  }: GetCategoryActivitiesRecordUseCaseRequest): Promise<GetCategoryActivitiesRecordUseCaseResponse> {
    const categoryActivityRecord = await this.auditRepository.getByEntityId(id);

    return right({ categoryActivityRecord });
  }
}
