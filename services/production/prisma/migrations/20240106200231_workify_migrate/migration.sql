/*
  Warnings:

  - You are about to drop the column `user_password` on the `user_account` table. All the data in the column will be lost.
  - Added the required column `password` to the `user_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "user_password",
ADD COLUMN     "password" VARCHAR NOT NULL,
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
