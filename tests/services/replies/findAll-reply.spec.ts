import { TypeTweet } from '@prisma/client';
import { prismaMock } from '../../config/prisma.mock';
import { ReplyMock } from '../../mock/reply.mock';
import { ReplyService } from "../../../src/services/reply.service";

describe('ReplyService - findAll', () => {
	const createSut = () => new ReplyService();
	const tokenUser = 'user-123';

	it('Deve retornar todas as replies do usuário', async () => {
		const sut = createSut();

		const repliesMock = [
			ReplyMock.build({ id: 'reply-1', userId: tokenUser }),
			ReplyMock.build({ id: 'reply-2', userId: tokenUser }),
		];

		prismaMock.reply.findMany.mockResolvedValue(repliesMock);

		const result = await sut.findAll(tokenUser, null as any);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Replies buscados com sucesso !');
		expect(result.data).toEqual(
			repliesMock.map((reply) => ({
				id: reply.id,
				content: reply.content,
				type: reply.type,
				userId: reply.userId,
				tweetId: reply.tweetId,
				createdAt: reply.createdAt,
			}))
		);

		expect(prismaMock.reply.findMany).toHaveBeenCalledWith({
			where: { userId: tokenUser },
		});
	});

	it("Deve filtrar replies pelo tipo quando 'type' for fornecido", async () => {
		const sut = createSut();
		const type = TypeTweet.Reply;

		const repliesMock = [
			ReplyMock.build({ id: 'reply-1', userId: tokenUser, type }),
			ReplyMock.build({ id: 'reply-2', userId: tokenUser, type }),
		];

		prismaMock.reply.findMany.mockResolvedValue(repliesMock);

		const result = await sut.findAll(tokenUser, type);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Replies buscados com sucesso !');
		expect(result.data).toHaveLength(2);
		expect(
			(result.data as Array<{ type: TypeTweet }>).every(
				(reply) => reply.type === type
			)
		).toBeTruthy();

		expect(prismaMock.reply.findMany).toHaveBeenCalledWith({
			where: { userId: tokenUser, type: { equals: type } },
		});
	});

	it('Deve retornar uma lista vazia se o usuário não tiver replies', async () => {
		const sut = createSut();

		prismaMock.reply.findMany.mockResolvedValue([]);

		const result = await sut.findAll(tokenUser, null as any);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Replies buscados com sucesso !');
		expect(result.data).toEqual([]);

		expect(prismaMock.reply.findMany).toHaveBeenCalledWith({
			where: { userId: tokenUser },
		});
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar as replies', async () => {
		const sut = createSut();

		prismaMock.reply.findMany.mockRejectedValue(
			new Error('Erro ao buscar replies')
		);

		await expect(sut.findAll(tokenUser, null as any)).rejects.toThrow(
			'Erro ao buscar replies'
		);

		expect(prismaMock.reply.findMany).toHaveBeenCalledWith({
			where: { userId: tokenUser },
		});

		expect(prismaMock.reply.findMany).toHaveBeenCalledTimes(1);
	});
});
