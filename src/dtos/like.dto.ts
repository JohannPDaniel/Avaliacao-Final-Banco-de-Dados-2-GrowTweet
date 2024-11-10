export interface CreateLikeDto {
    userId: string;
    tweetId: string;
}

export interface LikeDto {
	id: string;
	userId: string;
	tweetId: string;
	createdAt: Date;
}
