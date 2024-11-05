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
	tweet?: Array<Tweets>;
	like?: Array<Like>;

	followers?: Array<FollowerDetails>; // Detalhes dos seguidores
	following?: Array<FollowingDetails>; // Detalhes dos seguidos
}

export interface FollowerDetails {
	userId: string;
	name: string;
	username: string;
	email: string;
}

export interface FollowingDetails {
	userId: string;
	name: string;
	username: string;
	email: string;
}

export interface Tweets {
	content: string;
	type: string;
	like?: Array<Like>;
	reply?: Array<Reply>;
}

export interface Like {
	userId: string;
	tweetId: string;
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
	user?: {
		name: string;
		username: string;
		email: string;
	};
}
