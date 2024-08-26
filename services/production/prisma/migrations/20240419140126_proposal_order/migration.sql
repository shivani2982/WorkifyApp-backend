/*
  Warnings:

  - You are about to drop the column `client_id` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `freelancer_id` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `client_comment` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the column `freelancer_comment` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the column `freelancer_id` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the column `proposal_status_id` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the column `proposal_time` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the `proposal_status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `proposal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_client_id_fkey";

-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal" DROP CONSTRAINT "proposal_client_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal" DROP CONSTRAINT "proposal_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal" DROP CONSTRAINT "proposal_proposal_status_id_fkey";

-- AlterTable
ALTER TABLE "contract" DROP COLUMN "client_id",
DROP COLUMN "end_time",
DROP COLUMN "freelancer_id",
DROP COLUMN "payment_id",
DROP COLUMN "start_time",
ADD COLUMN     "contract_status" TEXT NOT NULL DEFAULT 'working',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "proposal" DROP COLUMN "client_comment",
DROP COLUMN "client_id",
DROP COLUMN "freelancer_comment",
DROP COLUMN "freelancer_id",
DROP COLUMN "proposal_status_id",
DROP COLUMN "proposal_time",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "proposal_status" TEXT NOT NULL DEFAULT 'waiting',
ADD COLUMN     "revisions" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "useraccount_id" INTEGER;

-- DropTable
DROP TABLE "proposal_status";

-- CreateTable
CREATE TABLE "has_proposal_task" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER,
    "proposal_id" INTEGER,

    CONSTRAINT "has_proposal_task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "has_proposal_task" ADD CONSTRAINT "has_proposal_task_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("proposal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "has_proposal_task" ADD CONSTRAINT "has_proposal_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;
