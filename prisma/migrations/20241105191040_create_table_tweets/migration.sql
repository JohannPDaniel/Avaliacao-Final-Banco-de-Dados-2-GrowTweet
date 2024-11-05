-- CreateEnum
CREATE TYPE "GrowTweet"."TypeTweet" AS ENUM ('Tweet', 'Reply');

-- CreateTable
CREATE TABLE "GrowTweet"."tweets" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "type" "GrowTweet"."TypeTweet" NOT NULL DEFAULT 'Tweet',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tweets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GrowTweet"."tweets" ADD CONSTRAINT "tweets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "GrowTweet"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
