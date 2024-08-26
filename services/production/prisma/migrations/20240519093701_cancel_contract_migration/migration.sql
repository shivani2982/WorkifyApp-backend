-- CreateTable
CREATE TABLE "cancel_contract" (
    "id" SERIAL NOT NULL,
    "contract_id" INTEGER,
    "user_id" INTEGER,
    "message" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cancel_contract_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cancel_contract" ADD CONSTRAINT "cancel_contract_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract"("contract_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancel_contract" ADD CONSTRAINT "cancel_contract_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
