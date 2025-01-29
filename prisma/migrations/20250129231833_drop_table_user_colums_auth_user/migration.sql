/*
  Warnings:

  - You are about to drop the column `auth_token` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "GrowTweet"."users_auth_token_idx";

-- AlterTable
ALTER TABLE "GrowTweet"."users" DROP COLUMN "auth_token";
