import { TypeTweet } from '@prisma/client';
import { InfoUser } from './user.dto';
import { Like, LikeDto } from "./like.dto";
import { Reply, ReplyDto } from "./reply.dto";

export interface TweetDto {
	id: string;
	content: string;
	type: TypeTweet;
	userId: string;
	createdAt: Date;
	likeCount: number;
	likedByCurrentUser?: boolean;
	like?: Array<LikeDtoInterface>;
	reply?: Array<ReplyDto>;
}

export type CreateTweetDto = Pick<TweetDto, 'content' | 'type' | 'userId'> & {
	authUser: InfoUser;
};

export type Tweets = Pick<TweetDto, "content" | "type" | "createdAt"> & { like?: Array<Like>, reply?: Array<Reply>};

export type LikeDtoInterface = Pick<
	LikeDto,
	'id' | 'userId' | 'tweetId' | 'createdAt'
>;
