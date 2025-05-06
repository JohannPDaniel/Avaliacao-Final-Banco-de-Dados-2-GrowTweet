import { FeedService } from '../../../src/services/feed.service';
import { prismaMock } from '../../config/prisma.mock';
import { TypeTweet } from '@prisma/client';
import { FollowerMock, TweetMock, UserMock } from '../../mock';

describe('FeedService - findAll', () => {
	const createSut = () => new FeedService();

	const userMock = UserMock.build();
	const tweetMock = TweetMock.build();
	const followerMock = FollowerMock.build();
	const { id, name, email, password, username, createdAt, updatedAt } =
		userMock;

	const allUsersMock = [
		userMock,
		{
			id: 'raquel-id',
			name: 'Raquel Costa',
			username: 'raquel',
			email: 'raquel@email.com',
			password: 'hash',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	it('Deve retornar 404 quando o usuário não for encontrado', async () => {
		const sut = createSut();
		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.findAll('user-invalido', 'Tweet');

		expect(result).toEqual({
			success: false,
			code: 404,
			message: 'Usuário não encontrado.',
			data: [],
		});
	});

	it('Deve retornar o feed vazio quando não houver tweets', async () => {
		const sut = createSut();

		prismaMock.user.findUnique.mockResolvedValue({
			id,
			name,
			username,
			email,
			password,
			createdAt,
			updatedAt,
		});

		prismaMock.follower.findMany.mockResolvedValue([]);
		prismaMock.tweet.findMany.mockResolvedValue([]);
		prismaMock.user.findMany.mockResolvedValue(allUsersMock);

		const result = await sut.findAll(userMock.id, 'Tweet');

		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data).toEqual([]);
	});

	it('Deve incluir tweets do próprio usuário no feed', async () => {
		const sut = createSut();

		const tweetMock = TweetMock.build({
			userId: userMock.id,
			content: 'meu tweet pessoal',
			user: {
				id: userMock.id,
				name: userMock.name,
				username: userMock.username,
			},
		});

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.follower.findMany.mockResolvedValue([]);
		prismaMock.tweet.findMany.mockResolvedValue([tweetMock]);
		prismaMock.user.findMany.mockResolvedValue([userMock]);

		const result = await sut.findAll(userMock.id, TypeTweet.Tweet);

		expect(result.success).toBe(true);
		expect(result.data).toHaveLength(1);
		expect(result.data[0].userId).toBe(userMock.id);
	});

	it('Deve remover tweets dos seguidos que mencionam outros usuários', async () => {
		const sut = createSut();

		prismaMock.user.findUnique.mockResolvedValue(userMock);

		const followerMock = FollowerMock.build({
			userId: userMock.id,
			followerId: 'johann-id',
		});

		const tweetMock = TweetMock.build({
			userId: 'johann-id',
			content: 'Olá Raquel',
			user: {
				id: 'johann-id',
				name: 'Johann',
				username: 'johann',
			},
		});

		prismaMock.follower.findMany.mockResolvedValue([followerMock]);
		prismaMock.tweet.findMany.mockResolvedValue([tweetMock]);
		prismaMock.user.findMany.mockResolvedValue(allUsersMock);

		const result = await sut.findAll(userMock.id, TypeTweet.Tweet);

		expect(result.success).toBe(true);
		expect(result.data).toHaveLength(0); // tweet deve ser removido
	});

	it('Deve retornar tweets válidos corretamente filtrados', async () => {
		const sut = createSut();

		const userMock = UserMock.build({
			id: 'user-id',
			name: 'Miguel Silva',
			username: 'miguel',
			email: 'miguel@email.com',
		});

		const followerMock = FollowerMock.build({
			userId: userMock.id,
			followerId: 'johann-id',
		});

		const tweetMock = TweetMock.build({
			userId: 'johann-id',
			content: 'Olá Miguel', // ← importante
			user: {
				id: 'johann-id',
				name: 'Johann',
				username: 'johann',
			},
		});

		const allUsersMock = [
			userMock,
			{
				id: 'raquel-id',
				name: 'Raquel Costa',
				username: 'raquel',
				email: 'raquel@email.com',
				password: 'hash',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.follower.findMany.mockResolvedValue([followerMock]);
		prismaMock.tweet.findMany.mockResolvedValue([tweetMock]);
		prismaMock.user.findMany.mockResolvedValue(allUsersMock);

		const result = await sut.findAll(userMock.id, TypeTweet.Tweet);

		expect(result.success).toBe(true);
		expect(result.data).toHaveLength(1);
		expect(result.data[0].content).toContain('Miguel');
	});
});
