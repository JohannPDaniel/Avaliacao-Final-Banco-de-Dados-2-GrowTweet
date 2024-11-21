import { TypeTweet } from "@prisma/client";

export interface CreateUserDto {
    name: string;
    email: string;
    username: string;
    password: string
}

export interface UpdateUserDto {
	name?: string;
	email?: string;
	username?: string;
	password?: string;
}

export interface UserDto {
	id: string;
	name: string;
	email: string;
	username: string;
	createdAt: Date;
	tweet?: Array<Tweets>;
	like?: Array<Like>;

	followers?: Array<FollowerDetails>; 
	following?: Array<FollowingDetails>; 
}

export interface FollowerDetails {
	userId: string;
	name: string;
	username: string;
	email: string;
	createdAt: Date;
}

export interface FollowingDetails {
	userId: string;
	name: string;
	username: string;
	email: string;
	createdAt: Date;
}

export interface Tweets {
	content: string;
	type: string;
	like?: Array<Like>;
	reply?: Array<Reply>;
	createdAt: Date;
}

export interface Like {
	userId: string;
	tweetId: string;
	createdAt: Date;

	user?: {
		name: string;
		username: string;
		email: string;
	};
}

export interface Reply {
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
	createdAt: Date;

	user?: {
		name: string;
		username: string;
		email: string;
	};
}
