/*
  Warnings:

  - You are about to drop the column `star` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "star",
ADD COLUMN     "stars" INTEGER DEFAULT 0;
