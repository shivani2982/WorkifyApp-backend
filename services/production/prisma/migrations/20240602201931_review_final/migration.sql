/*
  Warnings:

  - You are about to drop the column `postUser_id` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `review` table. All the data in the column will be lost.
  - Added the required column `received_review_userId` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_postUser_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_user_id_fkey";

-- AlterTable
ALTER TABLE "review" DROP COLUMN "postUser_id",
DROP COLUMN "user_id",
ADD COLUMN     "received_review_userId" INTEGER NOT NULL,
ADD COLUMN     "send_review_userId" INTEGER;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_send_review_userId_fkey" FOREIGN KEY ("send_review_userId") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_received_review_userId_fkey" FOREIGN KEY ("received_review_userId") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
