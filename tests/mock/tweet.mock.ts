import { Tweet, TypeTweet } from '@prisma/client';
import { randomUUID } from 'crypto';

interface TweetMockInterface {
	id?: string;
	content?: string;
	type?: TypeTweet;
	userId?: string;
	user?: {
		id: string;
		name: string;
		username: string;
	};
	Like?: any[];
	Reply?: any[];
}

export class TweetMock {
	public static build(params?: TweetMockInterface): Tweet & {
		user: { id: string; name: string; username: string };
		Like: any[];
		Reply: any[];
	} {
		return {
			id: params?.id || randomUUID(),
			content: params?.content || 'any_content',
			type: params?.type || TypeTweet.Tweet,
			userId: params?.userId || 'any_id',
			createdAt: new Date(),
			updatedAt: new Date(),
			user: {
				id: params?.user?.id || randomUUID(),
				name: params?.user?.name || 'any_name',
				username: params?.user?.username || 'any_username',
			},
			Like: params?.Like || [],
			Reply: params?.Reply || [],
		};
	}
}
