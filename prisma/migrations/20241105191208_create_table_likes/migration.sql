-- CreateTable
CREATE TABLE "GrowTweet"."likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tweet_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_tweet_id_key" ON "GrowTweet"."likes"("user_id", "tweet_id");

-- AddForeignKey
ALTER TABLE "GrowTweet"."likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "GrowTweet"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowTweet"."likes" ADD CONSTRAINT "likes_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "GrowTweet"."tweets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
