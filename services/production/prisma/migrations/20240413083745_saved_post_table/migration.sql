-- CreateTable
CREATE TABLE "saved_post" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN,
    "job_id" INTEGER,
    "useraccount_id" INTEGER NOT NULL,

    CONSTRAINT "saved_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saved_post" ADD CONSTRAINT "saved_post_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_post" ADD CONSTRAINT "saved_post_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
