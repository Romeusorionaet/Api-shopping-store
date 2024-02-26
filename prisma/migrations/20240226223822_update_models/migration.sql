/*
  Warnings:

  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `productQuantity` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - Made the column `width` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "productQuantity",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "stockQuantity" DROP DEFAULT,
ALTER COLUMN "minimumQuantityStock" DROP DEFAULT,
ALTER COLUMN "discountPercentage" DROP DEFAULT,
ALTER COLUMN "width" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
