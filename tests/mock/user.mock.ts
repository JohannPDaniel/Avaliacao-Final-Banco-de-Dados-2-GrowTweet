import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
interface UserMockInterface {
	name?: string;
	username?: string;
	email?: string;
}

export class UserMock {
	public static build(params?: UserMockInterface): User {
		return {
			id: randomUUID(),
			name: 'any_name',
			email: params?.email || 'any_email',
			username: params?.username || 'any_username',
			password: 'hashed_password',
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}
}
