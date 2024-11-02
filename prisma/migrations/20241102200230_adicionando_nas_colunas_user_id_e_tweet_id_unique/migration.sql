/*
  Warnings:

  - A unique constraint covering the columns `[user_id,tweet_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_tweet_id_key" ON "GrowTweet"."likes"("user_id", "tweet_id");
