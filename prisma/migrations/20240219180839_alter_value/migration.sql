-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "slug" DROP NOT NULL;
