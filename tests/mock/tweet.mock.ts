import { Tweet, TypeTweet } from "@prisma/client";
import { randomUUID } from "crypto";

interface TweetMockInterface {
    id?: string;
    content?: string;
    type?: TypeTweet
    userId?: string;
}

export class TweetMock {
    public static build(params?: TweetMockInterface): Tweet {
        return {
            id: randomUUID(),
            content: params?.content || "any_content",
            type: TypeTweet.Tweet,
            userId: "any_id",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}