import { Like, Reply, TypeTweet } from '@prisma/client';

export interface CreateTweetDto {
	content: string;
	type: TypeTweet;
	userId: string;
	authUser: { id: string; name: string; username: string };
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

export interface Tweets {
	content: string;
	type: string;
	like?: Array<Like>;
	reply?: Array<Reply>;
	createdAt: Date;
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
