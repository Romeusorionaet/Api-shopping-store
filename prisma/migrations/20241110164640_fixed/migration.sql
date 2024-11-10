/*
  Warnings:

  - You are about to drop the column `categoryId` on the `ActivityRecord` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ActivityRecord` table. All the data in the column will be lost.
  - Added the required column `entity_id` to the `ActivityRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `ActivityRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PRODUCT', 'CATEGORY');

-- AlterEnum
ALTER TYPE "ActivityStatus" ADD VALUE 'DELETED';

-- DropForeignKey
ALTER TABLE "ActivityRecord" DROP CONSTRAINT "ActivityRecord_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityRecord" DROP CONSTRAINT "ActivityRecord_productId_fkey";

-- AlterTable
ALTER TABLE "ActivityRecord" DROP COLUMN "categoryId",
DROP COLUMN "productId",
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "entity_type" "EntityType" NOT NULL;
