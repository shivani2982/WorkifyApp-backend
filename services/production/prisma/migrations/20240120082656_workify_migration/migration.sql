/*
  Warnings:

  - The `status` column on the `feature_job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "feature_job" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN;
