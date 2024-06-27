import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeNotification } from "test/factories/make-notification";
import { FetchNotificationsUseCase } from "./fetch-notifications";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: FetchNotificationsUseCase;

describe("Fetch Notifications", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new FetchNotificationsUseCase(inMemoryNotificationsRepository);
  });

  test("should be able to fetch notifications", async () => {
    const notification1 = makeNotification({ title: "note1" });
    const notification2 = makeNotification({ title: "note2" });

    inMemoryNotificationsRepository.create(notification1);
    inMemoryNotificationsRepository.create(notification2);

    const result = await sut.execute({
      recipientId: notification1.recipientId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items).toHaveLength(2);
  });
});
