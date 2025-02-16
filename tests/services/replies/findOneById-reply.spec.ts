import { TypeTweet } from '@prisma/client';
import { prismaMock } from '../../config/prisma.mock';
import { ReplyService } from '../../../src/services/reply.service';

describe('ReplyService - findOneById', () => {
	const createSut = () => new ReplyService();
	const tokenUser = 'user-123';

	it('Deve retornar erro 404 se a reply não existir', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findFirst.mockResolvedValue(null);

		const result = await sut.findOneById(tokenUser, replyId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Reply a ser buscado não encontrado ou não pertence ao usuário autenticado!'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
	});

	it('Deve retornar erro 404 se a reply existir, mas não pertencer ao usuário', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findFirst.mockResolvedValue(null);

		const result = await sut.findOneById(tokenUser, replyId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Reply a ser buscado não encontrado ou não pertence ao usuário autenticado!'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
	});

	it('Deve retornar a reply corretamente quando encontrada', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		const replyMock = {
			id: replyId,
			userId: tokenUser,
			content: 'Conteúdo da reply',
			type: TypeTweet.Reply,
			tweetId: 'tweet-456',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.reply.findFirst.mockResolvedValue(replyMock);

		const result = await sut.findOneById(tokenUser, replyId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Reply buscada pelo id com sucesso!');
		expect(result.data).toEqual(sut['mapToDto'](replyMock));
		expect(result.data?.id).toBe(replyMock.id);
		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar a reply', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findFirst.mockRejectedValue(
			new Error('Erro ao buscar reply')
		);

		await expect(sut.findOneById(tokenUser, replyId)).rejects.toThrow(
			'Erro ao buscar reply'
		);

		expect(prismaMock.reply.findFirst).toHaveBeenCalled();
		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
	});

	it('Não deve retornar uma reply caso o ID seja inválido (string vazia)', async () => {
		const sut = createSut();
		const replyId = ''; 

		prismaMock.reply.findFirst.mockResolvedValue(null);

		const result = await sut.findOneById(tokenUser, replyId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Reply a ser buscado não encontrado ou não pertence ao usuário autenticado!'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
	});
});
