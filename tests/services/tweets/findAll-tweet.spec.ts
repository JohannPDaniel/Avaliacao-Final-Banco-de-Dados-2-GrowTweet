import { TypeTweet } from '@prisma/client';
import { prismaMock } from '../../config/prisma.mock';
import { TweetMock } from '../../mock/tweet.mock';
import { TweetService } from "../../../src/services/tweet.service";

describe('TweetService - findAll', () => {
	const createSut = () => new TweetService();

	it('Deve retornar todos os tweets quando nenhum tipo for fornecido', async () => {
		const sut = createSut();
		const tokenUser = 'user-123';

		const tweetsMock = [
			TweetMock.build({ id: 'tweet-1' }),
			TweetMock.build({ id: 'tweet-2' }),
		];

		prismaMock.tweet.findMany.mockResolvedValue(tweetsMock);

		const result = await sut.findAll(tokenUser);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Tweets buscados com sucesso!');
		expect(result.data).toHaveLength(2);
		expect(result.data[0]).toHaveProperty('id');

		expect(prismaMock.tweet.findMany).toHaveBeenCalledWith({
			where: {},
			include: {
				Like: {
					include: {
						user: true,
					},
				},
			},
		});
		expect(prismaMock.tweet.findMany).toHaveBeenCalledTimes(1);
	});

	it('Deve retornar tweets filtrados pelo tipo quando `type` for fornecido', async () => {
		const sut = createSut();
		const tokenUser = 'user-123';
		const type = TypeTweet.Reply;

		const tweetsMock = [TweetMock.build({ id: 'tweet-1', type })];

		prismaMock.tweet.findMany.mockResolvedValue(tweetsMock);

		const result = await sut.findAll(tokenUser, type);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Tweets buscados com sucesso!');
		expect(result.data).toHaveLength(1);
		expect(result.data[0].type).toBe(type);

		expect(prismaMock.tweet.findMany).toHaveBeenCalledWith({
			where: { type },
			include: {
				Like: {
					include: {
						user: true,
					},
				},
			},
		});
		expect(prismaMock.tweet.findMany).toHaveBeenCalledTimes(1);
		expect(result.data[0]).toHaveProperty('id');
		expect(result.data[0]).toHaveProperty('content');
	});

	it('Deve retornar os tweets corretamente incluindo curtidas e likeCount', async () => {
		const sut = createSut();
		const tokenUser = 'user-123';

		const tweetsMock = [
			{
				...TweetMock.build({ id: 'tweet-1' }),
				Like: [{ userId: 'user-123' }, { userId: 'user-456' }],
			},
			{
				...TweetMock.build({ id: 'tweet-2' }),
				Like: [{ userId: 'user-789' }],
			},
		];

		prismaMock.tweet.findMany.mockResolvedValue(tweetsMock);

		const result = await sut.findAll(tokenUser);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Tweets buscados com sucesso!');
		expect(result.data).toHaveLength(2);
		expect(result.data[0].likeCount).toBe(2);

		expect(result.data[0].likedByCurrentUser).toBeTruthy();
		expect(result.data[1].likeCount).toBe(1);
		expect(result.data[1].likedByCurrentUser).toBeFalsy();

		expect(prismaMock.tweet.findMany).toHaveBeenCalledWith({
			where: {},
			include: {
				Like: {
					include: {
						user: true,
					},
				},
			},
		});
		expect(prismaMock.tweet.findMany).toHaveBeenCalledTimes(1);
		expect(result.data[0]).toHaveProperty('content');
		expect(result.data[1]).toHaveProperty('createdAt');
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar tweets', async () => {
		const sut = createSut();
		const tokenUser = 'user-123';

		prismaMock.tweet.findMany.mockRejectedValue(
			new Error('Erro ao buscar tweets')
		);

		await expect(sut.findAll(tokenUser)).rejects.toThrow(
			'Erro ao buscar tweets'
		);

		expect(prismaMock.tweet.findMany).toHaveBeenCalled();
		expect(prismaMock.tweet.findMany).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.findMany).toHaveBeenCalledWith({
			where: {},
			include: {
				Like: {
					include: {
						user: true,
					},
				},
			},
		});

		await expect(sut.findAll(tokenUser)).rejects.toBeInstanceOf(Error);
	});
});
