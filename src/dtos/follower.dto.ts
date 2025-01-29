export interface CreateFollowerDto {
	userId: string;
	followerId: string;
}

export interface FollowerDto {
	id: string;
	userId: string;
	followerId: string;
	createdAt: Date;
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
