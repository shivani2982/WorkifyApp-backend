/*
  Warnings:

  - You are about to drop the column `date_time` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `job_id` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `proposal_id` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `proposal_status_id` on the `message` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_job_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_proposal_status_id_fkey";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "date_time",
DROP COLUMN "job_id",
DROP COLUMN "proposal_id",
DROP COLUMN "proposal_status_id",
ADD COLUMN     "chatroom_id" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "chatroom" (
    "chatroom_id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "client_id" INTEGER,
    "job_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatroom_pkey" PRIMARY KEY ("chatroom_id")
);

-- AddForeignKey
ALTER TABLE "chatroom" ADD CONSTRAINT "chatroom_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatroom" ADD CONSTRAINT "chatroom_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("freelancer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatroom" ADD CONSTRAINT "chatroom_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatroom_id_fkey" FOREIGN KEY ("chatroom_id") REFERENCES "chatroom"("chatroom_id") ON DELETE CASCADE ON UPDATE CASCADE;
