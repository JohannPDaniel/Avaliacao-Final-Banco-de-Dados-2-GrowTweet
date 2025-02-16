import { Follower } from '@prisma/client';
import { randomUUID } from 'crypto';

interface FollowerMockInterface {
	id?: string;
	userId?: string;
	followerId?: string;
}

export class FollowerMock {
	public static build(params?: FollowerMockInterface): Follower {
		return {
			id: params?.id || randomUUID(),
			userId: params?.userId || 'any_user_id',
			followerId: params?.followerId || 'any_follower_id',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}
}
