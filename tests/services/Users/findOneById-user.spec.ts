import { UserService } from '../../../src/services/user.service';
import { prismaMock } from '../../config/prisma.mock';
import { UserMock } from '../../mock/user.mock';

describe('UserService - findOneById', () => {
	const createSut = () => new UserService();

	it('Deve retornar erro 403 se o usuário tentar acessar um ID diferente do próprio', async () => {
		const sut = createSut();
		const userId = 'user-123';
		const tokenUser = 'user-456'; // ID diferente

		const result = await sut.findOneById(userId, tokenUser);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para acessar este usuario.'
		);

		expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 404 se o usuário não for encontrado', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.findOneById(userId, userId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário a ser buscado não encontrado!');

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
		});

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

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		const result = async () => await sut.findOneById(userId, userId);

		expect(result).rejects.toThrow('Erro ao buscar usuário');

		expect(prismaMock.user.findUnique).toHaveBeenCalled();
	});
});
