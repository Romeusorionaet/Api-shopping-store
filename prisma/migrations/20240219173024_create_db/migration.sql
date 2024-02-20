-- CreateEnum
CREATE TYPE "ModeOfSale" AS ENUM ('SELLS_ONLY_IN_THE_REGION', 'ONLINE_STORE');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productQuantity" INTEGER NOT NULL DEFAULT 0,
    "imgUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "categoryTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "imgUrlList" TEXT[],
    "stockQuantity" INTEGER NOT NULL DEFAULT 10,
    "minimumQuantityStock" INTEGER NOT NULL DEFAULT 2,
    "discountPercentage" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "weight" INTEGER,
    "corsList" TEXT[],
    "placeOfSale" "ModeOfSale" NOT NULL DEFAULT 'ONLINE_STORE',
    "star" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
