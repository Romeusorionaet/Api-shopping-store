-- CreateEnum
CREATE TYPE "ModeOfSale" AS ENUM ('SELLS_ONLY_IN_THE_REGION', 'ONLINE_STORE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING_FOR_PAYMENT', 'PAYMENT_CONFIRMED');

-- CreateEnum
CREATE TYPE "OrderStatusTracking" AS ENUM ('WAITING', 'CANCELED', 'PRODUCT_DELIVERED_TO_CARRIER', 'PRODUCT_DELIVERED_TO_CLIENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_address" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "house_number" INTEGER NOT NULL,
    "complement" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "category_title" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img_url_list" TEXT[],
    "color_list" TEXT[],
    "price" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "minimum_quantity_stock" INTEGER NOT NULL,
    "discount_percentage" INTEGER NOT NULL,
    "stars" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "placeOfSale" "ModeOfSale" NOT NULL DEFAULT 'ONLINE_STORE',
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_products_details" (
    "id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "ram" INTEGER NOT NULL,
    "rom" INTEGER NOT NULL,
    "video_resolution" TEXT NOT NULL,
    "battery_capacity" TEXT NOT NULL,
    "screen_or_watch_face" TEXT NOT NULL,
    "average_battery_life" TEXT NOT NULL,
    "video_capture_resolution" TEXT NOT NULL,
    "processor_brand" TEXT NOT NULL,
    "operating_system" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "technical_products_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tracking_code" TEXT NOT NULL DEFAULT '',
    "order_status_tracking" "OrderStatusTracking" NOT NULL DEFAULT 'WAITING',
    "status" "OrderStatus" NOT NULL DEFAULT 'WAITING_FOR_PAYMENT',
    "buyerId" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_address" (
    "id" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "house_number" INTEGER NOT NULL,
    "complement" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyerId" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "buyer_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "base_price" DECIMAL(8,2) NOT NULL,
    "discount_percentage" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL,
    "color_list" TEXT[],
    "productId" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "order_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "products_title_key" ON "products"("title");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_products_details" ADD CONSTRAINT "technical_products_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_address" ADD CONSTRAINT "buyer_address_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_address" ADD CONSTRAINT "buyer_address_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
