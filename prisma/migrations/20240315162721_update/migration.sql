/*
  Warnings:

  - You are about to drop the column `buyer_address` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderStatusTracking" AS ENUM ('WAITING', 'CANCELED', 'PRODUCT_DELIVERED_TO_CARRIER', 'PRODUCT_DELIVERED_TO_CLIENT');

-- AlterTable
ALTER TABLE "buyer_address" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "buyer_address",
DROP COLUMN "productId",
ADD COLUMN     "order_status_tracking" "OrderStatusTracking" NOT NULL DEFAULT 'WAITING',
ADD COLUMN     "trackingCode" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "buyer_address" ADD CONSTRAINT "buyer_address_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
