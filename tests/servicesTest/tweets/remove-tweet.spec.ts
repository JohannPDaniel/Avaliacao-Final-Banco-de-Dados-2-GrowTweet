import { prismaMock } from '../../config/prisma.mock';
import { TweetMock } from '../../mock/tweet.mock';
import { TweetService } from '../../services/tweet.service';

describe('TweetService - remove', () => {
	const createSut = () => new TweetService();

	it('Deve retornar erro 403 se o tweet não pertencer ao usuário logado', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = 'user-123';

		prismaMock.tweet.findFirst.mockResolvedValue(null);

		const result = await sut.remove(tweetId, tokenUser);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para deletar este tweet.'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledWith({
			where: { id: tweetId, userId: tokenUser },
		});
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.delete).not.toHaveBeenCalled();
	});

	it('Deve deletar o tweet com sucesso quando o usuário tem permissão', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = 'user-123';

		const tweetMock = TweetMock.build({ id: tweetId, userId: tokenUser });

		prismaMock.tweet.findFirst.mockResolvedValue(tweetMock);
		prismaMock.tweet.delete.mockResolvedValue(tweetMock);

		const result = await sut.remove(tweetId, tokenUser);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Tweet deletado com sucesso!');
		expect(result.data).toEqual({
			id: tweetMock.id,
			content: tweetMock.content,
			type: tweetMock.type,
			userId: tweetMock.userId,
			createdAt: tweetMock.createdAt,
			updatedAt: tweetMock.updatedAt,
			likeCount: 0,
			likedByCurrentUser: false,
			reply: undefined,
			like: undefined,
		});
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledWith({
			where: { id: tweetId, userId: tokenUser },
		});
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.delete).toHaveBeenCalledWith({
			where: { id: tweetId },
		});
		expect(prismaMock.tweet.delete).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o tweet', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = 'user-123';

		prismaMock.tweet.findFirst.mockRejectedValue(
			new Error('Erro ao buscar tweet')
		);

		await expect(sut.remove(tweetId, tokenUser)).rejects.toThrow(
			'Erro ao buscar tweet'
		);

		expect(prismaMock.tweet.findFirst).toHaveBeenCalled();
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.delete).not.toHaveBeenCalled();
		expect(typeof prismaMock.tweet.findFirst).toBe('function');
		expect(typeof sut.remove).toBe('function');
	});

	it('Deve lançar um erro se o Prisma falhar ao deletar o tweet', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUser = 'user-123';

		const tweetMock = TweetMock.build({ id: tweetId, userId: tokenUser });

		prismaMock.tweet.findFirst.mockResolvedValue(tweetMock);
		prismaMock.tweet.delete.mockRejectedValue(
			new Error('Erro ao deletar tweet')
		);

		await expect(sut.remove(tweetId, tokenUser)).rejects.toThrow(
			'Erro ao deletar tweet'
		);

		expect(prismaMock.tweet.findFirst).toHaveBeenCalled();
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.delete).toHaveBeenCalled();
		expect(prismaMock.tweet.delete).toHaveBeenCalledTimes(1);
		expect(typeof prismaMock.tweet.delete).toBe('function');
	});
});
