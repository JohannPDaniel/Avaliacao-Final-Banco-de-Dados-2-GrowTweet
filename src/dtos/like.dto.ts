import { User } from "./user.dto";

export interface CreateLikeDto {
    userId: string;
    tweetId: string;
}

export interface LikeDto {
	id: string;
	userId: string;
	tweetId: string;
	createdAt: Date;
	liked?: boolean; 
	likeCount?: number; 
}

export interface Like {
	userId: string;
	tweetId: string;
	createdAt: Date;
	user?: User;
}
