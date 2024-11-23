-- CreateIndex
CREATE INDEX "followers_user_id_idx" ON "GrowTweet"."followers"("user_id");

-- CreateIndex
CREATE INDEX "followers_follower_id_idx" ON "GrowTweet"."followers"("follower_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "GrowTweet"."likes"("user_id");

-- CreateIndex
CREATE INDEX "likes_tweet_id_idx" ON "GrowTweet"."likes"("tweet_id");

-- CreateIndex
CREATE INDEX "replies_tweet_id_idx" ON "GrowTweet"."replies"("tweet_id");

-- CreateIndex
CREATE INDEX "replies_user_id_idx" ON "GrowTweet"."replies"("user_id");

-- CreateIndex
CREATE INDEX "replies_created_at_idx" ON "GrowTweet"."replies"("created_at");

-- CreateIndex
CREATE INDEX "tweets_created_at_idx" ON "GrowTweet"."tweets"("created_at");

-- CreateIndex
CREATE INDEX "users_auth_token_idx" ON "GrowTweet"."users"("auth_token");
