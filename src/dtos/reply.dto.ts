import { TypeTweet } from '@prisma/client';

export interface CreateReplyDto {
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
}

export interface ReplyDto {
	id: string;
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
}

