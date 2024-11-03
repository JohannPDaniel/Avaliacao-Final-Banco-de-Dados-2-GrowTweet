export interface CreateFollowerDto {
	userId: string;
	followerId: string;
}

export interface FollowerDto {
	id: string;
	userId: string;
	followerId: string;
}

export interface QueryFollowerDto {
	userId: string;
	followerId: string;
}
