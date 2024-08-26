/*
  Warnings:

  - You are about to drop the column `client_id` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `freelancer_id` on the `review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_client_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_freelancer_id_fkey";

-- AlterTable
ALTER TABLE "review" DROP COLUMN "client_id",
DROP COLUMN "freelancer_id",
ADD COLUMN     "job_id" INTEGER,
ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
