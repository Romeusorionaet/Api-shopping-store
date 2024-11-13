import { makeActivityRecord } from "test/factories/make-activity-record";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryActivityRecordRepository } from "test/repositories/in-memory-activity-record-repository";
import { GetActivitiesRecordUseCase } from "./get-activities-record";

let activityRecordRepository: InMemoryActivityRecordRepository;
let sut: GetActivitiesRecordUseCase;

describe("Get activities record", () => {
  beforeEach(() => {
    activityRecordRepository = new InMemoryActivityRecordRepository();
    sut = new GetActivitiesRecordUseCase(activityRecordRepository);
  });

  test("should be able get activities record by entityId", async () => {
    const activityRecord = makeActivityRecord(
      {
        entityId: new UniqueEntityID("entity-id-test-01"),
      },
      new UniqueEntityID("activity-record-test-id"),
    );

    activityRecordRepository.items.push(activityRecord);

    const result = await sut.execute({ id: activityRecord.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(activityRecordRepository.items).length(1);
    expect(activityRecordRepository.items[0]).toEqual(
      expect.objectContaining({
        entityId: activityRecord.entityId,
      }),
    );
  });
});
