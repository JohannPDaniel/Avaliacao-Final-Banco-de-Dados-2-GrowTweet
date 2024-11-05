-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "GrowTweet";

-- CreateTable
CREATE TABLE "GrowTweet"."users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "password" TEXT NOT NULL,
    "auth_token" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "GrowTweet"."users"("email");
