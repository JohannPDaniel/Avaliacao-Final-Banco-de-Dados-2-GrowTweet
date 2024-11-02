export interface CreateLikeDto {
    userId: string;
    tweetId: string;
}

export interface LikeDto {
    id: string;
    userId: string;
    tweetId: string;
}

export interface QueryLikeDto {
    userId: string;
    tweetId: string;
}

export interface UpdateLikeDto {
    userId?: string;
    tweetId?: string;
}