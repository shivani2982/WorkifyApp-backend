/*
  Warnings:

  - You are about to drop the column `client_id` on the `chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `freelancer_id` on the `chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `freelancer_id` on the `message` table. All the data in the column will be lost.
  - Added the required column `useraccount_id` to the `chatroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chatroom" DROP CONSTRAINT "chatroom_client_id_fkey";

-- DropForeignKey
ALTER TABLE "chatroom" DROP CONSTRAINT "chatroom_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_client_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_freelancer_id_fkey";

-- AlterTable
ALTER TABLE "chatroom" DROP COLUMN "client_id",
DROP COLUMN "freelancer_id",
ADD COLUMN     "useraccount_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "message" DROP COLUMN "client_id",
DROP COLUMN "freelancer_id",
ADD COLUMN     "useraccount_id" INTEGER;

-- AddForeignKey
ALTER TABLE "chatroom" ADD CONSTRAINT "chatroom_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
