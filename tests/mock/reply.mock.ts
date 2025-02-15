import { Reply, TypeTweet } from "@prisma/client";
import { randomUUID } from "crypto";

interface ReplyMockInterface {
    id?: string;
    content?: string;
    type?: TypeTweet
    userId?: string;
}

export class ReplyMock {
    public static build(params?: ReplyMockInterface): Reply {
        return {
            id: params?.id || randomUUID(),
            content: params?.content || "any_content",
            type: params?.type || TypeTweet.Reply,
            userId: "any_user_id",
            tweetId: "any_tweet_id",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}