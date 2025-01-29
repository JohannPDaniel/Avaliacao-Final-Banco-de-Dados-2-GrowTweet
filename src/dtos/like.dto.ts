import { User } from './user.dto';

export interface LikeDto {
	id: string;
	userId: string;
	tweetId: string;
	createdAt: Date;
	liked?: boolean;
	likeCount?: number;
}

export type CreateLikeDto = Pick<LikeDto, 'userId' | 'tweetId'>;

export type Like = Pick<LikeDto, 'userId' | 'tweetId' | 'createdAt'> & {
	user?: User;
};
