import { TweetService } from '../../../src/services/tweet.service';
import { prismaMock } from '../../config/prisma.mock';
import { TweetMock } from '../../mock/tweet.mock';

describe('TweetService - update', () => {
	const createSut = () => new TweetService();

	it('Deve retornar erro 403 se o tweet não pertencer ao usuário logado', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUserId = 'user-123';

		prismaMock.tweet.findFirst.mockResolvedValue(null);

		const result = await sut.update(tweetId, tokenUserId, 'Novo conteúdo');

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para atualizar este tweet.'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledWith({
			where: { id: tweetId, userId: tokenUserId },
		});
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.update).not.toHaveBeenCalled();
	});

	it('Deve atualizar o tweet com sucesso quando o usuário tem permissão', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUserId = 'user-123';
		const newContent = 'Novo conteúdo do tweet';

		const tweetMock = TweetMock.build({ id: tweetId, userId: tokenUserId });

		prismaMock.tweet.findFirst.mockResolvedValue(tweetMock);
		prismaMock.tweet.update.mockResolvedValue({
			...tweetMock,
			content: newContent,
		});

		const result = await sut.update(tweetId, tokenUserId, newContent);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Tweet atualizado com sucesso!');
		expect(result.data).toEqual({
			id: tweetMock.id,
			content: newContent,
			type: tweetMock.type,
			userId: tweetMock.userId,
			createdAt: tweetMock.createdAt,
			updatedAt: tweetMock.updatedAt,
			likeCount: 0,
			likedByCurrentUser: false,
			like: undefined,
			reply: undefined,
		});
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledWith({
			where: { id: tweetId, userId: tokenUserId },
		});
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.update).toHaveBeenCalledWith({
			where: { id: tweetId },
			data: { content: newContent },
		});
		expect(prismaMock.tweet.update).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o tweet', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUserId = 'user-123';

		prismaMock.tweet.findFirst.mockRejectedValue(
			new Error('Erro ao buscar tweet')
		);

		await expect(
			sut.update(tweetId, tokenUserId, 'Novo conteúdo')
		).rejects.toThrow('Erro ao buscar tweet');

		expect(prismaMock.tweet.findFirst).toHaveBeenCalled();
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.update).not.toHaveBeenCalled();
		expect(typeof prismaMock.tweet.findFirst).toBe('function');
		expect(typeof sut.update).toBe('function');
	});

	it('Deve lançar um erro se o Prisma falhar ao atualizar o tweet', async () => {
		const sut = createSut();
		const tweetId = 'tweet-123';
		const tokenUserId = 'user-123';
		const newContent = 'Novo conteúdo do tweet';

		const tweetMock = TweetMock.build({ id: tweetId, userId: tokenUserId });

		prismaMock.tweet.findFirst.mockResolvedValue(tweetMock);
		prismaMock.tweet.update.mockRejectedValue(
			new Error('Erro ao atualizar tweet')
		);

		await expect(sut.update(tweetId, tokenUserId, newContent)).rejects.toThrow(
			'Erro ao atualizar tweet'
		);

		expect(prismaMock.tweet.findFirst).toHaveBeenCalled();
		expect(prismaMock.tweet.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.update).toHaveBeenCalled();
		expect(prismaMock.tweet.update).toHaveBeenCalledTimes(1);
		expect(typeof prismaMock.tweet.update).toBe('function');
	});
});
