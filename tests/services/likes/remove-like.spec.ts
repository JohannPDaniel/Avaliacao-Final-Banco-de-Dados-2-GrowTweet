import { Like } from "@prisma/client";
import { LikeDto } from "../../../src/dtos";
import { LikeService } from '../../../src/services/like.service';
import { prismaMock } from '../../config/prisma.mock';

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
		prismaMock.$transaction.mockResolvedValue([
			likeMock, 
			3, 
		]);

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Like deletado com sucesso!');
		expect(result.data).toEqual({
			id: likeMock.id,
			userId: likeMock.userId,
			tweetId: likeMock.tweetId,
			liked: false,
			likeCount: 3,
            createdAt: expect.any(Date)
		});

		expect(prismaMock.$transaction).toHaveBeenCalledWith([
			prismaMock.like.delete({ where: { id: likeId } }),
			prismaMock.like.count({ where: { tweetId } }),
		]);
	});

	it('Deve retornar erro 500 se o Prisma falhar ao buscar o like', async () => {
		const sut = createSut();
		const likeId = 'like-123';

		prismaMock.like.findFirst.mockRejectedValue(
			new Error('Erro ao buscar like')
		);

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(500);
		expect(result.message).toBe('Erro ao buscar like');

		expect(prismaMock.like.findFirst).toHaveBeenCalled();
		expect(prismaMock.$transaction).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 500 se o Prisma falhar ao deletar o like', async () => {
		const sut = createSut();
		const likeId = 'like-123';
		const tweetId = 'tweet-456';

		const likeMock = {
			id: likeId,
			userId: tokenUser,
			tweetId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.like.findFirst.mockResolvedValue(likeMock);
		prismaMock.$transaction.mockResolvedValueOnce([null, 3]); // Simulando falha na deleção

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(500);
		expect(result.message).toBe('Erro ao deletar like!');

		expect(prismaMock.$transaction).toHaveBeenCalledWith([
			prismaMock.like.delete({ where: { id: likeId } }),
			prismaMock.like.count({ where: { tweetId } }),
		]);
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
		prismaMock.$transaction.mockResolvedValueOnce([
			likeMock, // like deletado
			null, // erro ao contar os likes
		]);

		const result = await sut.remove(tokenUser, likeId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(500);
		expect(result.message).toBe('Erro ao contar os likes restantes!');

		expect(prismaMock.$transaction).toHaveBeenCalled();
	});
});
