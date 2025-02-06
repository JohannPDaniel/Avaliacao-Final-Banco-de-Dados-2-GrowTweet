import { FollowerDetails, FollowingDetails } from './follower.dto';
import { Like } from "./like.dto";
import { Tweets } from './tweet.dto';

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

export type UserMockType = Pick<UserDto, "id" | "name" | "username" | "email" | "createdAt"> & { password: string, updatedAt: Date};

export type CreateUserDto = Pick<UserDto, 'name' | 'email' | 'username'> & {
	password: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export type User = Omit<CreateUserDto, 'password'>;

export type InfoUser = Pick<UserDto, "id" | "name" | "username">
