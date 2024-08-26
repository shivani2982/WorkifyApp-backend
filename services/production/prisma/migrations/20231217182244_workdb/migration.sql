-- CreateTable
CREATE TABLE "attachment" (
    "attachment_id" SERIAL NOT NULL,
    "message_id" INTEGER,
    "attachment_link" VARCHAR,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "client" (
    "client_id" SERIAL NOT NULL,
    "useraccount_id" INTEGER,
    "reg_date" DATE,
    "location" VARCHAR,
    "overview" VARCHAR,

    CONSTRAINT "client_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "contract" (
    "contract_id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "client_id" INTEGER,
    "proposal_id" INTEGER,
    "start_time" TIME(6),
    "end_time" TIME(6),
    "payment_id" INTEGER,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "duration" (
    "duration_id" SERIAL NOT NULL,
    "text_column" VARCHAR,

    CONSTRAINT "duration_pkey" PRIMARY KEY ("duration_id")
);

-- CreateTable
CREATE TABLE "feature_job" (
    "feature_id" SERIAL NOT NULL,
    "status" VARCHAR,

    CONSTRAINT "feature_job_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "freelancer" (
    "freelancer_id" SERIAL NOT NULL,
    "useraccount_id" INTEGER,
    "reg_date" DATE,
    "overview" VARCHAR,
    "experience" VARCHAR,
    "provider" VARCHAR,
    "description" VARCHAR,
    "links" VARCHAR,
    "location" VARCHAR,

    CONSTRAINT "freelancer_pkey" PRIMARY KEY ("freelancer_id")
);

-- CreateTable
CREATE TABLE "has_skill" (
    "id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "skill_id" INTEGER,

    CONSTRAINT "has_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "job_id" SERIAL NOT NULL,
    "job_description" VARCHAR,
    "freelancer_id" INTEGER,
    "client_id" INTEGER,
    "duration_id" INTEGER,
    "skillcategory_id" INTEGER,
    "payment_id" INTEGER,
    "feature_id" INTEGER,

    CONSTRAINT "job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "message" (
    "message_id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "client_id" INTEGER,
    "job_id" INTEGER,
    "date_time" TIMESTAMP(6),
    "msg_text" VARCHAR,
    "proposal_id" INTEGER,
    "proposal_status_id" INTEGER,

    CONSTRAINT "message_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "other_category" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER,
    "skillcategory_id" INTEGER,

    CONSTRAINT "other_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "type_name" VARCHAR,
    "payment_amount" DECIMAL(10,2),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "proposal" (
    "proposal_id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "client_id" INTEGER,
    "job_id" INTEGER,
    "proposal_time" TIME(6),
    "payment_id" INTEGER,
    "proposal_status_id" INTEGER,
    "client_comment" VARCHAR,
    "freelancer_comment" VARCHAR,

    CONSTRAINT "proposal_pkey" PRIMARY KEY ("proposal_id")
);

-- CreateTable
CREATE TABLE "proposal_status" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR,

    CONSTRAINT "proposal_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "review_id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "client_id" INTEGER,
    "start_time" TIME(6),
    "end_time" TIME(6),
    "rating" DECIMAL,
    "review_comment" VARCHAR,

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "skill_category" (
    "skill_id" SERIAL NOT NULL,
    "skill_name" VARCHAR,

    CONSTRAINT "skill_category_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "task" (
    "task_id" SERIAL NOT NULL,
    "task_description" VARCHAR,
    "job_id" INTEGER,
    "duration_id" INTEGER,

    CONSTRAINT "task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "user_account" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR,
    "email" VARCHAR,
    "user_password" VARCHAR,
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "gender" VARCHAR,
    "image" VARCHAR,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "job_attachment" (
    "attachment_id" SERIAL NOT NULL,
    "job_id" INTEGER,
    "image" VARCHAR,
    "documents" VARCHAR,

    CONSTRAINT "job_attachment_pkey" PRIMARY KEY ("attachment_id")
);

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("freelancer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("payment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("proposal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freelancer" ADD CONSTRAINT "freelancer_useraccount_id_fkey" FOREIGN KEY ("useraccount_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "has_skill" ADD CONSTRAINT "has_skill_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("freelancer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "has_skill" ADD CONSTRAINT "has_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill_category"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_duration_id_fkey" FOREIGN KEY ("duration_id") REFERENCES "duration"("duration_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature_job"("feature_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("freelancer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("payment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_skillcategory_id_fkey" FOREIGN KEY ("skillcategory_id") REFERENCES "skill_category"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("freelancer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("proposal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_proposal_status_id_fkey" FOREIGN KEY ("proposal_status_id") REFERENCES "proposal_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other_category" ADD CONSTRAINT "other_category_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other_category" ADD CONSTRAINT "other_category_skillcategory_id_fkey" FOREIGN KEY ("skillcategory_id") REFERENCES "skill_category"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("freelancer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("payment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_proposal_status_id_fkey" FOREIGN KEY ("proposal_status_id") REFERENCES "proposal_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("freelancer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_duration_id_fkey" FOREIGN KEY ("duration_id") REFERENCES "duration"("duration_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_attachment" ADD CONSTRAINT "job_attachment_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
