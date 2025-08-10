/*
  Warnings:

  - Added the required column `totalAmount` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "totalAmount" INTEGER NOT NULL;
