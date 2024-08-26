/*
  Warnings:

  - You are about to drop the column `reg_date` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `reg_date` on the `freelancer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_name]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `freelancer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_account` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_name` on table `user_account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user_account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_password` on table `user_account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "client" DROP COLUMN "reg_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "freelancer" DROP COLUMN "reg_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "user_name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "user_password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_name" ON "user_account"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "user_account"("email");
