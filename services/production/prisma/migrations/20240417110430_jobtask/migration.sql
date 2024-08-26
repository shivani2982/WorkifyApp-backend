/*
  Warnings:

  - You are about to drop the column `duration_id` on the `task` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "duration_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
