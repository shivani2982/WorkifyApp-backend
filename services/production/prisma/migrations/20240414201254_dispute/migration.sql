-- CreateTable
CREATE TABLE "dispute" (
    "dispute_id" SERIAL NOT NULL,
    "useraccount_id" INTEGER,
    "complain_title" VARCHAR,
    "complain_msg" VARCHAR,
    "complain_img" VARCHAR,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispute_pkey" PRIMARY KEY ("dispute_id")
);

-- CreateTable
CREATE TABLE "dispute_complains" (
    "id" SERIAL NOT NULL,
    "dispute_id" INTEGER NOT NULL,
    "useraccount_id" INTEGER,
    "complain_msg" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispute_complains_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispute_complains" ADD CONSTRAINT "dispute_complains_dispute_id_fkey" FOREIGN KEY ("dispute_id") REFERENCES "dispute"("dispute_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispute_complains" ADD CONSTRAINT "dispute_complains_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
