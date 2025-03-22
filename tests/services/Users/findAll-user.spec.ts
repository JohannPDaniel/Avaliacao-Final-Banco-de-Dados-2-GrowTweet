import { UserService } from "../../../src/services/user.service";
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
		expect(result.data).toHaveLength(2);
		expect(
			result.data.map((user: (typeof usersMock)[0]) => user.email)
		).toEqual(['user1@email.com', 'user2@email.com']);

		expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: {} });
		expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
		expect(result.data[0]).toHaveProperty('id');
		expect(result.data[1]).toHaveProperty('username');
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
		expect(result.data[0].email).toBe('match@email.com');

		expect(prismaMock.user.findMany).toHaveBeenCalledWith({
			where: { email: { contains: 'match' } },
		});
		expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
		expect(result.data[0]).toHaveProperty('id');
		expect(result.data[0]).toHaveProperty('username');
		expect(result.data[0]).toHaveProperty('createdAt');
	});

	it('Deve retornar uma lista vazia quando não houver usuários', async () => {
		const sut = createSut();
		prismaMock.user.findMany.mockResolvedValue([]);

		const result = await sut.findAll('');

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuários buscado com sucesso !');
		expect(result.data).toHaveLength(0);
		expect(Array.isArray(result.data)).toBeTruthy();

		expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: {} });
		expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
		expect(result.data).toEqual([]);
		expect(typeof result.message).toBe('string');
		expect(typeof result.code).toBe('number');
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar usuários', async () => {
		const sut = createSut();

		prismaMock.user.findMany.mockRejectedValue(
			new Error('Erro ao buscar usuários')
		);

		await expect(sut.findAll('')).rejects.toThrow('Erro ao buscar usuários');

		expect(prismaMock.user.findMany).toHaveBeenCalled();
		expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
		expect(typeof prismaMock.user.findMany).toBe('function');
		expect(typeof sut.findAll).toBe('function');
		expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: {} });
	});
});
