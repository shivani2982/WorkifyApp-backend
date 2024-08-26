-- AlterTable
ALTER TABLE "review" ADD COLUMN     "postUser_id" INTEGER;

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_postUser_id_fkey" FOREIGN KEY ("postUser_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
