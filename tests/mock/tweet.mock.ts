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
			id: params?.id || randomUUID(),
			content: params?.content || 'any_content',
			type: params?.type || TypeTweet.Tweet,
			userId: params?.userId || 'any_id',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}
}
