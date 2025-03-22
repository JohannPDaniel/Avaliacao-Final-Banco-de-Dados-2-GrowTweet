import { Like } from '@prisma/client';
import { prismaMock } from '../../config/prisma.mock';
import { LikeService } from '../../services/like.service';

describe('LikeService - remove', () => {
	const createSut = () => new LikeService();
	const tokenUser = 'user-123';

	it('Deve retornar erro 404 se o like não existir ou não pertencer ao usuário', async () => {
		const sut = createSut();
		const likeId = 'like-123';

		prismaMock.like.findFirst.mockResolvedValue(null);

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Like a ser deletado não encontrado ou não pertence ao usuário autenticado!'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.like.findFirst).toHaveBeenCalledWith({
			where: { id: likeId, userId: tokenUser },
		});
		expect(prismaMock.$transaction).not.toHaveBeenCalled();
	});

	it('Deve deletar o like com sucesso', async () => {
		const sut = createSut();
		const likeId = 'like-123';
		const tweetId = 'tweet-456';

		const likeMock: Like = {
			id: likeId,
			userId: tokenUser,
			tweetId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.like.findFirst.mockResolvedValue(likeMock);
		prismaMock.$transaction.mockResolvedValue([likeMock, 3]); // 3 likes restantes

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Like deletado com sucesso!');
		expect(result.data).toEqual({
			id: likeMock.id,
			userId: likeMock.userId,
			tweetId: likeMock.tweetId,
			createdAt: expect.any(Date),
			liked: false,
			likeCount: 3,
		});
		expect(prismaMock.$transaction).toHaveBeenCalledWith([
			prismaMock.like.delete({ where: { id: likeId } }),
			prismaMock.like.count({ where: { tweetId } }),
		]);
	});

	it('Deve deletar o like e retornar `likeCount` como 0 quando for o último like', async () => {
		const sut = createSut();
		const likeId = 'like-123';
		const tweetId = 'tweet-456';

		const likeMock: Like = {
			id: likeId,
			userId: tokenUser,
			tweetId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.like.findFirst.mockResolvedValue(likeMock);
		prismaMock.$transaction.mockResolvedValue([likeMock, 0]); // Último like removido

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Like deletado com sucesso!');
		expect(result.data).toEqual({
			id: likeMock.id,
			userId: likeMock.userId,
			tweetId: likeMock.tweetId,
			createdAt: expect.any(Date),
			liked: false,
			likeCount: 0,
		});
		expect(prismaMock.$transaction).toHaveBeenCalled();
	});

	it('Deve retornar erro 500 se `$transaction` retornar um array incompleto', async () => {
		const sut = createSut();
		const likeId = 'like-123';
		const tweetId = 'tweet-456';

		const likeMock: Like = {
			id: likeId,
			userId: tokenUser,
			tweetId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.like.findFirst.mockResolvedValue(likeMock);
		prismaMock.$transaction.mockResolvedValueOnce([likeMock]); // Array incompleto

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(500);
		expect(result.message).toBe('Erro ao processar a remoção do like!');
		expect(result.data).toBeUndefined();
		expect(prismaMock.$transaction).toHaveBeenCalled();
	});

	it('Deve retornar erro 500 se o Prisma falhar ao contar os likes restantes', async () => {
		const sut = createSut();
		const likeId = 'like-123';
		const tweetId = 'tweet-456';

		const likeMock: Like = {
			id: likeId,
			userId: tokenUser,
			tweetId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.like.findFirst.mockResolvedValue(likeMock);
		prismaMock.$transaction.mockResolvedValueOnce([likeMock, null]); // Erro ao contar likes

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(500);
		expect(result.message).toBe('Erro ao contar os likes restantes!');
		expect(result.data).toBeUndefined();
		expect(prismaMock.$transaction).toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o like', async () => {
		const sut = createSut();
		const likeId = 'like-123';

		prismaMock.like.findFirst.mockRejectedValue(
			new Error('Erro ao buscar like')
		);

		await expect(sut.remove(tokenUser, likeId)).rejects.toThrow(
			'Erro ao buscar like'
		);

		expect(prismaMock.like.findFirst).toHaveBeenCalled();
		expect(prismaMock.$transaction).not.toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao deletar o like', async () => {
		const sut = createSut();
		const likeId = 'like-123';
		const tweetId = 'tweet-456';

		const likeMock: Like = {
			id: likeId,
			userId: tokenUser,
			tweetId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.like.findFirst.mockResolvedValue(likeMock);
		prismaMock.$transaction.mockRejectedValue(
			new Error('Erro ao deletar like')
		);

		await expect(sut.remove(tokenUser, likeId)).rejects.toThrow(
			'Erro ao deletar like'
		);

		expect(prismaMock.$transaction).toHaveBeenCalled();
	});
});
