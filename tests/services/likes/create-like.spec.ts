import { LikeService } from "../../../src/services/like.service";
import { prismaMock } from '../../config/prisma.mock';
import { LikeMock } from '../../mock/like.mock';
import { TweetMock } from '../../mock/tweet.mock';
import { UserMock } from '../../mock/user.mock';

describe('LikeService - create', () => {
	const createSut = () => new LikeService();
	const tokenUser = 'user-123';

	it('Deve retornar erro 403 se o tokenUser for diferente do userId', async () => {
		const sut = createSut();
		const createLikeDto = { userId: 'user-456', tweetId: 'tweet-123' };

		const result = await sut.create(tokenUser, createLikeDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para curtir este tweet em nome de outro usuário.'
		);
		expect(result.data).toBeUndefined();
		expect(typeof createLikeDto).toBe('object');
	});

	it('Deve retornar erro 404 se o usuário não existir', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.create(tokenUser, createLikeDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário não encontrado!');
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: tokenUser },
		});
		expect(prismaMock.tweet.findUnique).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 404 se o tweet não existir', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockResolvedValue(null);

		const result = await sut.create(tokenUser, createLikeDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Tweet não encontrado!');
		expect(prismaMock.tweet.findUnique).toHaveBeenCalledWith({
			where: { id: 'tweet-123' },
		});
		expect(typeof createLikeDto.tweetId).toBe('string');
	});

	it('Deve retornar erro 409 se o like já existir', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockResolvedValue(
			TweetMock.build({ id: 'tweet-123' })
		);
		prismaMock.like.findFirst.mockResolvedValue(
			LikeMock.build({ id: 'like-123' })
		);

		const result = await sut.create(tokenUser, createLikeDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(409);
		expect(result.message).toBe(
			'Like já existe. Use a função de descurtir para remover.'
		);
		expect(prismaMock.like.findFirst).toHaveBeenCalledWith({
			where: { userId: tokenUser, tweetId: 'tweet-123' },
		});
		expect(result.data).toBeUndefined();
	});

	it('Deve criar um like com sucesso', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockResolvedValue(
			TweetMock.build({ id: 'tweet-123' })
		);
		prismaMock.like.findFirst.mockResolvedValue(null);
		prismaMock.like.create.mockResolvedValue({
			id: 'like-123',
			userId: tokenUser,
			tweetId: 'tweet-123',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		prismaMock.like.count.mockResolvedValue(5);

		const result = await sut.create(tokenUser, createLikeDto);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(201);
		expect(result.message).toBe('Like criado com sucesso!');
		expect(result.data).toEqual({
			id: 'like-123',
			userId: tokenUser,
			tweetId: 'tweet-123',
			liked: true,
			likeCount: 5,
			createdAt: expect.any(Date),
		});
		expect(prismaMock.like.create).toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		await expect(sut.create(tokenUser, createLikeDto)).rejects.toThrow(
			'Erro ao buscar usuário'
		);

		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.tweet.findUnique).not.toHaveBeenCalled();
		expect(typeof tokenUser).toBe('string');
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o tweet', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockRejectedValue(
			new Error('Erro ao buscar tweet')
		);

		await expect(sut.create(tokenUser, createLikeDto)).rejects.toThrow(
			'Erro ao buscar tweet'
		);

		expect(prismaMock.tweet.findUnique).toHaveBeenCalled();
		expect(typeof createLikeDto.tweetId).toBe('string');
	});

	it('Deve lançar um erro se o Prisma falhar ao criar o like', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockResolvedValue(
			TweetMock.build({ id: 'tweet-123' })
		);
		prismaMock.like.findFirst.mockResolvedValue(null);
		prismaMock.like.create.mockRejectedValue(new Error('Erro ao criar like'));

		await expect(sut.create(tokenUser, createLikeDto)).rejects.toThrow(
			'Erro ao criar like'
		);

		expect(prismaMock.like.create).toHaveBeenCalled();
		expect(typeof createLikeDto).toBe('object');
	});

	it('Deve lançar um erro se o Prisma falhar ao contar os likes', async () => {
		const sut = createSut();
		const createLikeDto = { userId: tokenUser, tweetId: 'tweet-123' };

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockResolvedValue(
			TweetMock.build({ id: 'tweet-123' })
		);
		prismaMock.like.findFirst.mockResolvedValue(null);
		prismaMock.like.create.mockResolvedValue({
			id: 'like-123',
			userId: tokenUser,
			tweetId: 'tweet-123',
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
		prismaMock.like.count.mockRejectedValue(new Error('Erro ao contar likes'));

		await expect(sut.create(tokenUser, createLikeDto)).rejects.toThrow(
			'Erro ao contar likes'
		);

		expect(prismaMock.like.count).toHaveBeenCalledWith({
			where: { tweetId: 'tweet-123' },
		});
		expect(typeof createLikeDto.tweetId).toBe('string');
	});
});
