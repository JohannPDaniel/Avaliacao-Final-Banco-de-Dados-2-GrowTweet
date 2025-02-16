import { ReplyService } from '../../../src/services/reply.service';
import { prismaMock } from '../../config/prisma.mock';
import { ReplyMock } from '../../mock/reply.mock';

describe('ReplyService - remove', () => {
	const createSut = () => new ReplyService();
	const tokenUser = 'user-123';

	it('Deve retornar erro 404 se a reply não existir ou não pertencer ao usuário', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findFirst.mockResolvedValue(null);

		const result = await sut.remove(tokenUser, replyId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Reply a ser deletada não encontrada ou não pertence ao usuário autenticado!'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.delete).not.toHaveBeenCalled();
	});

	it('Deve deletar a reply com sucesso', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		const replyMock = ReplyMock.build({
			id: replyId,
			userId: tokenUser,
		});

		prismaMock.reply.findFirst.mockResolvedValue(replyMock);
		prismaMock.reply.delete.mockResolvedValue(replyMock);

		const result = await sut.remove(tokenUser, replyId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Reply deletado com sucesso !');
		expect(result.data).toEqual({
			id: replyMock.id,
			userId: replyMock.userId,
			tweetId: replyMock.tweetId,
			content: replyMock.content,
			type: replyMock.type,
			createdAt: replyMock.createdAt,
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.delete).toHaveBeenCalledWith({
			where: { id: replyId },
		});
		expect(prismaMock.reply.delete).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar erro padronizado se o Prisma falhar ao buscar a reply', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findFirst.mockRejectedValue(
			new Error('Erro ao buscar reply')
		);

		await expect(sut.remove(tokenUser, replyId)).rejects.toThrow(
			'Erro ao buscar reply'
		);

		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.delete).not.toHaveBeenCalled();
	});

	it('Deve lançar erro padronizado se o Prisma falhar ao deletar a reply', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		const replyMock = ReplyMock.build({
			id: replyId,
			userId: tokenUser,
		});

		prismaMock.reply.findFirst.mockResolvedValue(replyMock);
		prismaMock.reply.delete.mockRejectedValue(
			new Error('Erro ao deletar reply')
		);

		await expect(sut.remove(tokenUser, replyId)).rejects.toThrow(
			'Erro ao deletar reply'
		);

		expect(prismaMock.reply.findFirst).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.delete).toHaveBeenCalledWith({
			where: { id: replyId },
		});
		expect(prismaMock.reply.delete).toHaveBeenCalledTimes(1);
	});

	it('Não deve chamar delete se a reply não for encontrada', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findFirst.mockResolvedValue(null);

		const result = await sut.remove(tokenUser, replyId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Reply a ser deletada não encontrada ou não pertence ao usuário autenticado!'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.reply.findFirst).toHaveBeenCalled();
		expect(prismaMock.reply.findFirst).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.delete).not.toHaveBeenCalled();
	});
});
