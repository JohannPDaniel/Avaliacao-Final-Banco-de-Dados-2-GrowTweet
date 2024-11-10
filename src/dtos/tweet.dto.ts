import { TypeTweet } from "@prisma/client";

export interface CreateTweetDto {
	content: string;
	type: TypeTweet;
	userId: string;
}

export interface TweetDto {
	id: string;
	content: string;
	type: TypeTweet;
	userId: string;
	createdAt: Date;
	like?: Array<LikeDtoInterface>;
	reply?: Array<ReplyDtoInterface>;
}

export interface LikeDtoInterface {
	userId: string;
	tweetId: string;
	createdAt: Date;
}

export interface ReplyDtoInterface {
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
	createdAt: Date;
}
