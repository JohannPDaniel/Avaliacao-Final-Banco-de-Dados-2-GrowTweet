-- CreateTable
CREATE TABLE "GrowTweet"."followers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "follower_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "followers_user_id_follower_id_key" ON "GrowTweet"."followers"("user_id", "follower_id");

-- AddForeignKey
ALTER TABLE "GrowTweet"."followers" ADD CONSTRAINT "followers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "GrowTweet"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowTweet"."followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "GrowTweet"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
