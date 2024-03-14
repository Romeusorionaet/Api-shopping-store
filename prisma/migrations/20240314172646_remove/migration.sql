/*
  Warnings:

  - You are about to drop the column `role` on the `buyer_address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "buyer_address" DROP COLUMN "role";

-- DropEnum
DROP TYPE "AddressRole";
