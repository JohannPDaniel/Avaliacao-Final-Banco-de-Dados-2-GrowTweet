-- This is an empty migration.
ALTER TABLE "GrowTweet"."followers"
ADD CONSTRAINT no_self_follow CHECK ("user_id" <> "follower_id");
