import { TypeTweet } from '@prisma/client';
import { prismaMock } from '../../config/prisma.mock';
import { ReplyMock } from '../../mock/reply.mock';
import { TweetMock } from '../../mock/tweet.mock';
import { UserMock } from '../../mock/user.mock';
import { ReplyService } from "../../../src/services/reply.service";

describe('ReplyService - create', () => {
	const createSut = () => new ReplyService();
	const tokenUser = 'user-123';

	it('Deve retornar erro 403 se o usuário tentar responder em nome de outro usuário', async () => {
		const sut = createSut();
		const createReplyDto = {
			userId: 'user-456',
			tweetId: 'tweet-123',
			content: 'Minha resposta',
			type: TypeTweet.Reply,
		};

		const result = await sut.create(tokenUser, createReplyDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para responder em nome de outro usuário.'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.reply.create).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 404 se o usuário não existir', async () => {
		const sut = createSut();
		const createReplyDto = {
			userId: tokenUser,
			tweetId: 'tweet-123',
			content: 'Minha resposta',
			type: TypeTweet.Reply,
		};

		prismaMock.user.findUnique.mockResolvedValue(null);
		prismaMock.tweet.findUnique.mockResolvedValue(
			TweetMock.build({ id: 'tweet-123' })
		);

		const result = await sut.create(tokenUser, createReplyDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário não encontrado!');
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: tokenUser },
		});
		expect(prismaMock.tweet.findUnique).not.toHaveBeenCalled();
		expect(prismaMock.reply.create).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 404 se o tweet não existir', async () => {
		const sut = createSut();
		const createReplyDto = {
			userId: tokenUser,
			tweetId: 'tweet-123',
			content: 'Minha resposta',
			type: TypeTweet.Reply,
		};

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockResolvedValue(null);

		const result = await sut.create(tokenUser, createReplyDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Tweet não encontrado!');
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: tokenUser },
		});
		expect(prismaMock.tweet.findUnique).toHaveBeenCalledWith({
			where: { id: 'tweet-123' },
		});
		expect(prismaMock.reply.create).not.toHaveBeenCalled();
	});

	it('Deve criar um reply com sucesso', async () => {
		const sut = createSut();
		const createReplyDto = {
			userId: tokenUser,
			tweetId: 'tweet-123',
			content: 'Minha resposta',
			type: TypeTweet.Reply,
		};

		const replyMock = ReplyMock.build({
			id: 'reply-123',
			content: createReplyDto.content,
			type: createReplyDto.type,
			userId: createReplyDto.userId,
		});

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.tweet.findUnique.mockResolvedValue(
			TweetMock.build({ id: 'tweet-123' })
		);
		prismaMock.reply.create.mockResolvedValue(replyMock);

		const result = await sut.create(tokenUser, createReplyDto);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(201);
		expect(result.message).toBe('Reply criado com sucesso!');
		expect(result.data).toEqual({
			id: replyMock.id,
			content: replyMock.content,
			type: replyMock.type,
			userId: replyMock.userId,
			tweetId: replyMock.tweetId,
			createdAt: replyMock.createdAt,
		});
		expect(prismaMock.reply.create).toHaveBeenCalledWith({
			data: {
				content: createReplyDto.content,
				type: createReplyDto.type,
				userId: createReplyDto.userId,
				tweetId: createReplyDto.tweetId,
			},
		});
		expect(prismaMock.reply.create).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();
		const createReplyDto = {
			userId: tokenUser,
			tweetId: 'tweet-123',
			content: 'Minha resposta',
			type: TypeTweet.Reply,
		};

		prismaMock.user.findUnique.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		await expect(sut.create(tokenUser, createReplyDto)).rejects.toThrow(
			'Erro ao buscar usuário'
		);

		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.tweet.findUnique).not.toHaveBeenCalled();
		expect(prismaMock.reply.create).not.toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
	});
});
