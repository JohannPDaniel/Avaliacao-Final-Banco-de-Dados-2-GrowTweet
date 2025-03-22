import { prismaMock } from '../../config/prisma.mock';
import { CreateTweetDto } from '../../dtos';
import { TweetMock } from '../../mock/tweet.mock';
import { UserMock } from '../../mock/user.mock';
import { TweetService } from '../../services/tweet.service';

describe('TweetService - create', () => {
	const createSut = () => new TweetService();

	it('Deve retornar erro 403 se o usuário tentar criar um tweet para outro usuário', async () => {
		const sut = createSut();
		const tweetData: CreateTweetDto = {
			content: 'Novo tweet',
			type: 'Tweet',
			userId: 'user-123',
			authUser: {
				id: 'user-456',
				name: 'any_name',
				username: 'any_username',
			},
		};

		const result = await sut.create(tweetData);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para criar um tweet.'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
		expect(prismaMock.tweet.create).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 404 se o usuário não existir', async () => {
		const sut = createSut();
		const userId = 'user-123';

		const tweetData: CreateTweetDto = {
			content: 'Novo tweet',
			type: 'Tweet',
			userId: 'user-123',
			authUser: {
				id: userId,
				name: 'any_name',
				username: 'any_username',
			},
		};

		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.create(tweetData);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário não encontrado!');
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.create).not.toHaveBeenCalled();
	});

	it('Deve criar um tweet com sucesso quando os dados forem válidos', async () => {
		const sut = createSut();
		const userId = 'user-123';

		const userMock = UserMock.build({ id: userId });
		const tweetMock = TweetMock.build({ userId });

		const tweetData: CreateTweetDto = {
			content: tweetMock.content,
			type: tweetMock.type,
			userId,
			authUser: {
				id: userId,
				name: 'any_name',
				username: 'any_username',
			},
		};

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.tweet.create.mockResolvedValue(tweetMock);

		const result = await sut.create(tweetData);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(201);
		expect(result.message).toBe('Tweet criado com sucesso !');
		expect(result.data).toEqual({
			id: tweetMock.id,
			content: tweetMock.content,
			type: tweetMock.type,
			userId: tweetMock.userId,
			createdAt: tweetMock.createdAt,
			updatedAt: tweetMock.updatedAt,
			like: undefined,
			likeCount: 0,
			likedByCurrentUser: false,
			reply: undefined,
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.create).toHaveBeenCalledWith({
			data: {
				content: tweetMock.content,
				type: tweetMock.type,
				userId,
			},
		});
		expect(prismaMock.tweet.create).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();
		const userId = 'user-123';

		const tweetData: CreateTweetDto = {
			content: 'Novo tweet',
			type: 'Tweet',
			userId,
			authUser: {
				id: userId,
				name: 'any_name',
				username: 'any_username',
			},
		};

		prismaMock.user.findUnique.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		await expect(sut.create(tweetData)).rejects.toThrow(
			'Erro ao buscar usuário'
		);

		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.create).not.toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao criar o tweet', async () => {
		const sut = createSut();
		const userId = 'user-123';

		const userMock = UserMock.build({ id: userId });

		const tweetData: CreateTweetDto = {
			content: 'Novo tweet',
			type: 'Tweet',
			userId,
			authUser: {
				id: userId,
				name: 'any_name',
				username: 'any_username',
			},
		};

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.tweet.create.mockRejectedValue(new Error('Erro ao criar tweet'));

		await expect(sut.create(tweetData)).rejects.toThrow('Erro ao criar tweet');

		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.tweet.create).toHaveBeenCalled();
		expect(prismaMock.tweet.create).toHaveBeenCalledTimes(1);
	});
});
