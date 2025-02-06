import { TypeTweet } from '@prisma/client';
import { InfoUser } from './user.dto';

export interface ReplyDto {
	id: string;
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
	createdAt: Date;
}

export type CreateReplyDto = Pick<
	ReplyDto,
	'content' | 'type' | 'userId' | 'tweetId'
>;

export type R = Pick<
	Omit<ReplyDto, 'id'>,
	'content' | 'type' | 'userId' | 'tweetId' | 'createdAt'
> & { user?: InfoUser };

export interface Reply {
	content: string;
	type: TypeTweet;
	userId: string;
	tweetId: string;
	createdAt: Date;
	user?: InfoUser;
}
