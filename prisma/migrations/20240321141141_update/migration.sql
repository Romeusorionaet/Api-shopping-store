-- DropForeignKey
ALTER TABLE "buyer_address" DROP CONSTRAINT "buyer_address_orderId_fkey";

-- AddForeignKey
ALTER TABLE "buyer_address" ADD CONSTRAINT "buyer_address_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
