import { UserService } from '../../../src/services/user.service';
import { prismaMock } from '../../config/prisma.mock';
import { UserMock } from '../../mock/user.mock';

describe('UserService - findAll', () => {
	const createSut = () => new UserService();

	it('Deve retornar todos os usuários quando nenhum email for fornecido', async () => {
		const sut = createSut();

		const usersMock = [
			UserMock.build({ email: 'user1@email.com' }),
			UserMock.build({ email: 'user2@email.com' }),
		];

		prismaMock.user.findMany.mockResolvedValue(usersMock);

		const result = await sut.findAll('');

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuários buscado com sucesso !');

		const expectedData = usersMock.map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			tweet: undefined,
			like: undefined,
			followers: undefined,
			following: undefined,
		}));

		expect(result.data).toEqual(expectedData);
		expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: {} });
	});

	it('Deve retornar usuários filtrados pelo email quando um email for fornecido', async () => {
		const sut = createSut();

		const usersMock = [UserMock.build({ email: 'match@email.com' })];

		prismaMock.user.findMany.mockResolvedValue(usersMock);

		const result = await sut.findAll('match');

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuários buscado com sucesso !');
		expect(result.data).toHaveLength(1);
		expect(result.data[0].email).toContain('match@email.com');

		expect(prismaMock.user.findMany).toHaveBeenCalledWith({
			where: { email: { contains: 'match' } },
		});
	});

	it('Deve retornar uma lista vazia quando não houver usuários', async () => {
		const sut = createSut();
		prismaMock.user.findMany.mockResolvedValue([]);

		const result = await sut.findAll('');

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuários buscado com sucesso !');
		expect(result.data).toHaveLength(0);

		expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: {} });
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar usuários', async () => {
		const sut = createSut();

		prismaMock.user.findMany.mockRejectedValue(
			new Error('Erro ao buscar usuários')
		);

        const result = async () => await sut.findAll("")

		expect(result).rejects.toThrow('Erro ao buscar usuários');

		expect(prismaMock.user.findMany).toHaveBeenCalled();
	});
});
