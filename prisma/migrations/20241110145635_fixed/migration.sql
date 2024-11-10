/*
  Warnings:

  - The values [CREATE] on the enum `ActivityStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityStatus_new" AS ENUM ('CREATED', 'UPDATED');
ALTER TABLE "ActivityRecord" ALTER COLUMN "activity_status" TYPE "ActivityStatus_new" USING ("activity_status"::text::"ActivityStatus_new");
ALTER TYPE "ActivityStatus" RENAME TO "ActivityStatus_old";
ALTER TYPE "ActivityStatus_new" RENAME TO "ActivityStatus";
DROP TYPE "ActivityStatus_old";
COMMIT;
