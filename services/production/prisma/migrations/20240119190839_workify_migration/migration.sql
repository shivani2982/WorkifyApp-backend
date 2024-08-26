/*
  Warnings:

  - You are about to drop the column `duration_id` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `review` table. All the data in the column will be lost.
  - You are about to drop the `duration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `feature_job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "job" DROP CONSTRAINT "job_duration_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_duration_id_fkey";

-- AlterTable
ALTER TABLE "feature_job" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "job" DROP COLUMN "duration_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" VARCHAR,
ADD COLUMN     "image" VARCHAR,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "review" DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "duration";
