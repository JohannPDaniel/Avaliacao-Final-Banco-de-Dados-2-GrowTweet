import { TypeTweet } from '@prisma/client';
import { User } from "./user.dto";

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
	createdAt: Date;
}

export interface Reply {
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
	createdAt: Date;
	user?: User;
}
