/*
  Warnings:

  - Added the required column `email_verified` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL,
ADD COLUMN     "picture" TEXT NOT NULL;
