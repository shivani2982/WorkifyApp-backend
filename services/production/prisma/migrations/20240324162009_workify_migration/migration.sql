/*
  Warnings:

  - You are about to drop the column `useraccount_id` on the `chatroom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chatroom" DROP CONSTRAINT "chatroom_useraccount_id_fkey";

-- AlterTable
ALTER TABLE "chatroom" DROP COLUMN "useraccount_id";

-- CreateTable
CREATE TABLE "user_chatroom" (
    "chatroom_id" INTEGER NOT NULL,
    "useraccount_id" INTEGER NOT NULL,

    CONSTRAINT "user_chatroom_pkey" PRIMARY KEY ("useraccount_id","chatroom_id")
);

-- AddForeignKey
ALTER TABLE "user_chatroom" ADD CONSTRAINT "user_chatroom_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chatroom" ADD CONSTRAINT "user_chatroom_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "chatroom"("chatroom_id") ON DELETE CASCADE ON UPDATE CASCADE;
