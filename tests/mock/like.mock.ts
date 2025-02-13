import { Like } from "@prisma/client";
import { randomUUID } from "crypto";

interface LikeMockInterface {
	id?: string;
	userId?: string;
	tweetId?: string;
}

export class LikeMock {
    public static build(params?: LikeMockInterface): Like {
        return {
            id: params?.id || randomUUID(),
            userId: params?.userId || "any_user_id",
            tweetId: params?.tweetId || "any_tweet_id",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}
