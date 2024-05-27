/*
  Warnings:

  - You are about to drop the column `product_color` on the `order_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_products" DROP COLUMN "product_color",
ADD COLUMN     "color_list" TEXT[];
