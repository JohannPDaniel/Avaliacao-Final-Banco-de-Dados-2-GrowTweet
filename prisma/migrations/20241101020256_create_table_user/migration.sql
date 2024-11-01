-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "GrowTweet";

-- CreateTable
CREATE TABLE "GrowTweet"."users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
