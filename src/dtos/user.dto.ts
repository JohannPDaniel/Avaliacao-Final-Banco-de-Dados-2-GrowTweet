import { FollowerDetails, FollowingDetails } from './follower.dto';
import { Like } from './like.dto';
import { Tweets } from './tweet.dto';
import {
	User as UserPrisma,
	Tweet as TweetPrisma,
	Like as LikePrisma,
	Reply as ReplyPrisma
} from '@prisma/client';

export interface UserDto {
	id: string;
	name: string;
	email: string;
	username: string;
	createdAt: Date;
	updatedAt: Date;
	tweet?: Array<Tweets>;
	like?: Array<Like>;
	followers?: Array<FollowerDetails>;
	following?: Array<FollowingDetails>;
}

export type UserMockType = Pick<
	UserDto,
	'id' | 'name' | 'username' | 'email' | 'createdAt'
> & { password: string; updatedAt: Date };

export type CreateUserDto = Pick<UserDto, 'name' | 'email' | 'username'> & {
	password: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export type User = Omit<CreateUserDto, 'password'>;

export type InfoUser = Pick<UserDto, 'id' | 'name' | 'username'>;

export type TweetWithRelations = TweetPrisma & {
	Like?: (LikePrisma & { user: UserPrisma })[];
	Reply?: (ReplyPrisma & { user: UserPrisma })[];
};

export type LikeWithRelations = LikePrisma & {
	tweet: TweetPrisma & {
		user: User;
	};
};

export type UserWithRelations = UserPrisma & {
	Tweet?: TweetWithRelations[];
	Like?: LikeWithRelations[];
	followers?: { user: UserPrisma }[];
	following?: { follower: UserPrisma }[];
};
