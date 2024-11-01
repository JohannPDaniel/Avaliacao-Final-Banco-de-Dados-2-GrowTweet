/*
  Warnings:

  - The `type` column on the `tweets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GrowTweet"."TypeTweet" AS ENUM ('Tweet', 'Reply');

-- AlterTable
ALTER TABLE "GrowTweet"."replies" ADD COLUMN     "type" "GrowTweet"."TypeTweet" NOT NULL DEFAULT 'Reply';

-- AlterTable
ALTER TABLE "GrowTweet"."tweets" DROP COLUMN "type",
ADD COLUMN     "type" "GrowTweet"."TypeTweet" NOT NULL DEFAULT 'Tweet';
