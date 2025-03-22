import { ReplyService } from "../../../src/services/reply.service";
import { prismaMock } from '../../config/prisma.mock';
import { ReplyMock } from '../../mock/reply.mock';

describe('ReplyService - update', () => {
	const createSut = () => new ReplyService();
	const tokenUser = 'user-123';

	it('Deve retornar erro 404 se a reply não existir ou não pertencer ao usuário', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findUnique.mockResolvedValue(null);

		const result = await sut.update(replyId, tokenUser, 'Novo conteúdo');

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Reply a ser atualizado não encontrado ou não pertence ao usuário autenticado!'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.reply.findUnique).toHaveBeenCalledWith({
			where: { id: replyId, userId: tokenUser },
		});
		expect(prismaMock.reply.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.update).not.toHaveBeenCalled();
	});

	it('Deve atualizar a reply com sucesso', async () => {
		const sut = createSut();
		const replyId = 'reply-123';
		const newContent = 'Novo conteúdo atualizado';

		const replyMock = ReplyMock.build({
			id: replyId,
			userId: tokenUser,
			content: 'Conteúdo antigo',
		});

		prismaMock.reply.findUnique.mockResolvedValue(replyMock);
		prismaMock.reply.update.mockResolvedValue({
			...replyMock,
			content: newContent,
		});

		const result = await sut.update(replyId, tokenUser, newContent);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Reply atualizado com sucesso !');
		expect(result.data).toEqual({
			id: replyMock.id,
			userId: replyMock.userId,
			tweetId: replyMock.tweetId,
			content: newContent,
			type: replyMock.type,
			createdAt: replyMock.createdAt,
		});
		expect(result.data.content).toBe(newContent);
		expect(prismaMock.reply.update).toHaveBeenCalledWith({
			where: { id: replyId },
			data: { content: newContent },
		});
		expect(prismaMock.reply.update).toHaveBeenCalledTimes(1);
	});

	it('Deve manter o conteúdo inalterado se `content` for undefined', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		const replyMock = ReplyMock.build({
			id: replyId,
			userId: tokenUser,
			content: 'Conteúdo inalterado',
		});

		prismaMock.reply.findUnique.mockResolvedValue(replyMock);
		prismaMock.reply.update.mockResolvedValue(replyMock);

		const result = await sut.update(replyId, tokenUser, undefined);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Reply atualizado com sucesso !');
		expect(result.data).toEqual({
			id: replyMock.id,
			userId: replyMock.userId,
			tweetId: replyMock.tweetId,
			content: 'Conteúdo inalterado',
			type: replyMock.type,
			createdAt: replyMock.createdAt,
		});

		expect(prismaMock.reply.update).toHaveBeenCalledWith({
			where: { id: replyId },
			data: { content: undefined },
		});
	});

	it('Deve lançar erro padronizado se o Prisma falhar ao buscar a reply', async () => {
		const sut = createSut();
		const replyId = 'reply-123';

		prismaMock.reply.findUnique.mockRejectedValue(
			new Error('Erro ao buscar reply')
		);

		await expect(
			sut.update(replyId, tokenUser, 'Novo conteúdo')
		).rejects.toThrow('Erro ao buscar reply');

		expect(prismaMock.reply.findUnique).toHaveBeenCalled();
		expect(prismaMock.reply.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.update).not.toHaveBeenCalled();
	});

	it('Deve lançar erro padronizado se o Prisma falhar ao atualizar a reply', async () => {
		const sut = createSut();
		const replyId = 'reply-123';
		const newContent = 'Novo conteúdo atualizado';

		const replyMock = ReplyMock.build({
			id: replyId,
			userId: tokenUser,
		});

		prismaMock.reply.findUnique.mockResolvedValue(replyMock);
		prismaMock.reply.update.mockRejectedValue(
			new Error('Erro ao atualizar reply')
		);

		await expect(sut.update(replyId, tokenUser, newContent)).rejects.toThrow(
			'Erro ao atualizar reply'
		);

		expect(prismaMock.reply.findUnique).toHaveBeenCalled();
		expect(prismaMock.reply.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.reply.update).toHaveBeenCalledWith({
			where: { id: replyId },
			data: { content: newContent },
		});
		expect(prismaMock.reply.update).toHaveBeenCalledTimes(1);
	});
});
