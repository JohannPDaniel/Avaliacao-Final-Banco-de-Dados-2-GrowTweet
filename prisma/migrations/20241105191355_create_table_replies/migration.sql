-- CreateTable
CREATE TABLE "GrowTweet"."replies" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "type" "GrowTweet"."TypeTweet" NOT NULL DEFAULT 'Reply',
    "user_id" UUID NOT NULL,
    "tweet_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GrowTweet"."replies" ADD CONSTRAINT "replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "GrowTweet"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowTweet"."replies" ADD CONSTRAINT "replies_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "GrowTweet"."tweets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
