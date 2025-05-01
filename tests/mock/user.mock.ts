import { User, Tweet as TweetPrisma, Like as LikePrisma } from "@prisma/client";
import { randomUUID } from 'crypto';

export type UserMockWithRelations = User & {
	Tweet?: TweetPrisma[];
	Like?: LikePrisma[];
	followers?: { user: User }[];
	following?: { follower: User }[];
};

interface UserMockInterface {
	id?: string;
	name?: string;
	username?: string;
	email?: string;
	tweets?: TweetPrisma[];
	likes?: LikePrisma[];
	followers?: { user: User }[];
	following?: { follower: User }[];
}

export class UserMock {
	public static build(params?: UserMockInterface): UserMockWithRelations {
		const user: UserMockWithRelations = {
			id: params?.id || randomUUID(),
			name: params?.name || 'any_name',
			email: params?.email || 'any_email',
			username: params?.username || 'any_username',
			password: 'hashed_password',
			createdAt: new Date(),
			updatedAt: new Date(),
			Tweet: params?.tweets || [],
			Like: params?.likes || [],
			followers: params?.followers || [],
			following: params?.following || [],
		};
		return user;
	}
}
