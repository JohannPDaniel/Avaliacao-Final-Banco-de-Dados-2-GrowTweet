import { TypeTweet } from '@prisma/client';

export interface CreateTweetDto {
	content: string;
	type: TypeTweet;
	userId: string;
	tokenUser: {id: string, name: string, username: string}
}

export interface TweetDto {
	id: string;
	content: string;
	type: TypeTweet;
	userId: string;
	createdAt: Date;
	likeCount: number;
	likedByCurrentUser?: boolean;
	like?: Array<LikeDtoInterface>;
	reply?: Array<ReplyDtoInterface>;
}

export interface LikeDtoInterface {
	id: string;
	userId: string;
	tweetId: string;
	createdAt: Date;
}

export interface ReplyDtoInterface {
	id: string;
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
	createdAt: Date;
}
