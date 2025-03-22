import { prismaMock } from '../../config/prisma.mock';
import { UserMock } from '../../mock/user.mock';
import { UserService } from '../../services/user.service';

describe('UserService - findOneById', () => {
	const createSut = () => new UserService();

	it('Deve retornar erro 403 se o usuário tentar acessar um ID diferente do próprio', async () => {
		const sut = createSut();
		const userId = 'user-123';
		const tokenUser = 'user-456';

		const result = await sut.findOneById(userId, tokenUser);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para acessar este usuario.'
		);
		expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
		expect(result.data).toBeUndefined();
	});

	it('Deve retornar erro 404 se o usuário não for encontrado', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.findOneById(userId, userId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário a ser buscado não encontrado!');
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
			include: {
				Tweet: {
					include: {
						Like: { include: { user: true } },
						Reply: { include: { user: true } },
					},
				},
				Like: {
					include: {
						tweet: { include: { user: true } },
					},
				},
				following: { include: { follower: true } },
				followers: { include: { user: true } },
			},
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
	});

	it('Deve retornar corretamente um usuário sem tweets, likes, seguidores ou seguindo', async () => {
		const sut = createSut();
		const userId = 'user-123';

		// Criando um usuário baseado no Prisma, mas incluindo relações manualmente para testes
		const userMock = {
			...UserMock.build({ id: userId }),
			Tweet: [],
			Like: [],
			following: [],
			followers: [],
		};

		// Simulando a resposta do Prisma corretamente
		prismaMock.user.findUnique.mockResolvedValue(userMock as any);

		const result = await sut.findOneById(userId, userId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuário buscado pelo id com sucesso!');
		expect(result.data).toEqual({
			id: userMock.id,
			name: userMock.name,
			email: userMock.email,
			username: userMock.username,
			createdAt: userMock.createdAt,
			updatedAt: userMock.updatedAt,
			tweet: [],
			like: [],
			following: [],
			followers: [],
		});

		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
			include: expect.any(Object),
		});
	});

	it('Deve retornar os dados do usuário corretamente quando encontrado', async () => {
		const sut = createSut();
		const userId = 'user-123';

		const userMock = UserMock.build({ id: userId });

		prismaMock.user.findUnique.mockResolvedValue(userMock);

		const result = await sut.findOneById(userId, userId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuário buscado pelo id com sucesso!');
		expect(result.data).toEqual({
			id: userMock.id,
			name: userMock.name,
			email: userMock.email,
			username: userMock.username,
			createdAt: userMock.createdAt,
			updatedAt: userMock.updatedAt,
			tweet: [],
			like: [],
			following: [],
			followers: [],
		});

		expect(result.data).toHaveProperty('id', userMock.id);
		expect(result.data).toHaveProperty('email', userMock.email);
		expect(result.data).toHaveProperty('username', userMock.username);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
			include: {
				Tweet: {
					include: {
						Like: { include: { user: true } },
						Reply: { include: { user: true } },
					},
				},
				Like: {
					include: {
						tweet: { include: { user: true } },
					},
				},
				following: { include: { follower: true } },
				followers: { include: { user: true } },
			},
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		const result = async () => await sut.findOneById(userId, userId);

		await expect(result).rejects.toThrow('Erro ao buscar usuário');
		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
			include: {
				Tweet: {
					include: {
						Like: { include: { user: true } },
						Reply: { include: { user: true } },
					},
				},
				Like: {
					include: {
						tweet: { include: { user: true } },
					},
				},
				following: { include: { follower: true } },
				followers: { include: { user: true } },
			},
		});
	});
});
