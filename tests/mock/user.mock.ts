import { User, Tweet as TweetPrisma, Like as LikePrisma } from '@prisma/client';
import { randomUUID } from 'crypto';

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
	public static build(params?: UserMockInterface): User & {
		Tweet?: TweetPrisma[];
		Like?: LikePrisma[];
		followers?: { user: User }[];
		following?: { follower: User }[];
	} {
		return {
			id: params?.id || randomUUID(),
			name: params?.name || 'any_name',
			email: params?.email || 'any_email',
			username: params?.username || 'any_username',
			password: 'hashed_password',
			createdAt: new Date(),
			updatedAt: new Date(),

			// Relacionamentos opcionais
			Tweet: params?.tweets || [],
			Like: params?.likes || [],
			followers: params?.followers || [],
			following: params?.following || [],
		};
	}
}
