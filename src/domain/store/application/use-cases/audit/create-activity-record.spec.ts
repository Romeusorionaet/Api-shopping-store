import { makeActivityRecord } from "test/factories/make-activity-record";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { CreateActivityRecordUseCase } from "./create-activity-record";
import { InMemoryActivityRecordRepository } from "test/repositories/in-memory-activity-record-repository";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let activityRecordRepository: InMemoryActivityRecordRepository;
let staffRepository: InMemoryStaffRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateActivityRecordUseCase;

describe("Create activity record", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    staffRepository = new InMemoryStaffRepository(usersRepository);
    activityRecordRepository = new InMemoryActivityRecordRepository(
      staffRepository,
    );
    sut = new CreateActivityRecordUseCase(activityRecordRepository);
  });

  test("should be able create a activity record", async () => {
    const activityRecord = makeActivityRecord(
      {},
      new UniqueEntityID("activity-record-test-id"),
    );

    const result = await sut.execute({
      staffId: activityRecord.staffId.toString(),
      entityId: activityRecord.entityId.toString(),
      entityType: activityRecord.entityType,
      dateTimeIso: activityRecord.dateTimeIso,
      status: activityRecord.status,
      commit: activityRecord.commit,
    });

    expect(result.isRight()).toBe(true);
    expect(activityRecordRepository.items[0]).toEqual(
      expect.objectContaining({
        staffId: activityRecord.staffId,
      }),
    );
  });
});
