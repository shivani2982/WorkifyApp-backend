-- AlterTable
ALTER TABLE "cancel_contract" ADD COLUMN     "image" VARCHAR;

-- AlterTable
ALTER TABLE "dispute_complains" ADD COLUMN     "image" VARCHAR;

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "received_review_userId" DROP NOT NULL;
