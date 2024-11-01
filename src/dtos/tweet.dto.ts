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
}

export interface UpdateTweetDto {
	content?: string;
	type?: TypeTweet;
	userId?: string;
}

