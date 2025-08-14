/*
  Warnings:

  - The `paid` column on the `Sale` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Sale" DROP COLUMN "paid",
ADD COLUMN     "paid" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'cashier';
