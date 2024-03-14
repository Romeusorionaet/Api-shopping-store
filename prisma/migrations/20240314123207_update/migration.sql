-- CreateEnum
CREATE TYPE "AddressRole" AS ENUM ('ORDER', 'BUYER');

-- AlterTable
ALTER TABLE "buyer_address" ADD COLUMN     "role" "AddressRole" NOT NULL DEFAULT 'BUYER';
