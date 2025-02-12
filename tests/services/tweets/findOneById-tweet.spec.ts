import { TweetService } from '../../../src/services/tweet.service';
import { prismaMock } from '../../config/prisma.mock';
import { TweetMock } from '../../mock/tweet.mock';

describe('TweetService - findOneById', () => {
	const createSut = () => new TweetService();

	it('Deve retornar erro 403 se o tweet não existir ou pertencer a outro usuário', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = {
			id: 'user-123',
			name: 'User Name',
			username: 'user123',
		};

		prismaMock.tweet.findUnique.mockResolvedValue(null);

		const result = await sut.findOneById(tweetId, tokenUser);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para acessar este tweet !'
		);

		expect(prismaMock.tweet.findUnique).toHaveBeenCalledWith({
			where: { id: tweetId, userId: tokenUser.id },
			include: {
				Like: { include: { user: true } },
				Reply: { include: { user: true } },
			},
		});
	});

	it('Deve retornar o tweet corretamente quando o usuário tem permissão', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = {
			id: 'user-123',
			name: 'User Name',
			username: 'user123',
		};

		const tweetMock = TweetMock.build({ id: tweetId, userId: tokenUser.id });

		prismaMock.tweet.findUnique.mockResolvedValue(tweetMock);
		prismaMock.like.count.mockResolvedValue(5);

		const result = await sut.findOneById(tweetId, tokenUser);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Tweets buscados pelo ID com sucesso!');
		expect(result.data).toEqual({
			id: tweetMock.id,
			content: tweetMock.content,
			type: tweetMock.type,
			userId: tweetMock.userId,
			createdAt: tweetMock.createdAt,
			updatedAt: tweetMock.updatedAt,
			likeCount: 5, 
            likedByCurrentUser: false,
            like: undefined,
            reply: undefined
		});

		expect(prismaMock.tweet.findUnique).toHaveBeenCalledWith({
			where: { id: tweetId, userId: tokenUser.id },
			include: {
				Like: { include: { user: true } },
				Reply: { include: { user: true } },
			},
		});

		expect(prismaMock.like.count).toHaveBeenCalledWith({
			where: { tweetId: tweetId },
		});
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o tweet', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = {
			id: 'user-123',
			name: 'User Name',
			username: 'user123',
		};

		prismaMock.tweet.findUnique.mockRejectedValue(
			new Error('Erro ao buscar tweet')
		);

		await expect(sut.findOneById(tweetId, tokenUser)).rejects.toThrow(
			'Erro ao buscar tweet'
		);

		expect(prismaMock.tweet.findUnique).toHaveBeenCalled();
		expect(prismaMock.like.count).not.toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao contar os likes', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = {
			id: 'user-123',
			name: 'User Name',
			username: 'user123',
		};

		const tweetMock = TweetMock.build({ id: tweetId, userId: tokenUser.id });

		prismaMock.tweet.findUnique.mockResolvedValue(tweetMock);
		prismaMock.like.count.mockRejectedValue(new Error('Erro ao contar likes'));

		await expect(sut.findOneById(tweetId, tokenUser)).rejects.toThrow(
			'Erro ao contar likes'
		);

		expect(prismaMock.tweet.findUnique).toHaveBeenCalled();
		expect(prismaMock.like.count).toHaveBeenCalled();
	});
});
