import { UserService } from "../../../src/services/user.service";
import { Bcrypt } from "../../../src/utils/bcrypt";
import { prismaMock } from '../../config/prisma.mock';
import { UserMock } from '../../mock/user.mock';

describe('UserService - update', () => {
	const createSut = () => new UserService();

	it('Deve retornar erro 403 se o usuário tentar atualizar um ID diferente do próprio', async () => {
		const sut = createSut();
		const userId = 'user-123';
		const tokenUser = 'user-456';
		const updateData = { name: 'Novo Nome' };

		const result = await sut.update(userId, tokenUser, updateData);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para atualizar este usuario.'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 404 se o usuário a ser atualizado não for encontrado', async () => {
		const sut = createSut();
		const userId = 'user-123';
		prismaMock.user.findUnique.mockResolvedValue(null);
		const updateData = { name: 'Novo Nome' };

		const result = await sut.update(userId, userId, updateData);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário a ser atualizado não encontrado !');
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
	});

	it('Deve atualizar o usuário com sucesso quando os dados forem válidos', async () => {
		const sut = createSut();
		const userId = 'user-123';
		const userMock = UserMock.build({ id: userId });

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		const updateData = { name: 'Novo Nome' };

		prismaMock.user.update.mockResolvedValue({
			...userMock,
			name: updateData.name,
		});

		const result = await sut.update(userId, userId, updateData);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuário atualizado com sucesso !');
		expect(result.data).toEqual({
			id: userMock.id,
			name: 'Novo Nome',
			email: userMock.email,
			username: userMock.username,
			createdAt: userMock.createdAt,
			updatedAt: userMock.updatedAt,
			tweet: [],
			like: [],
			followers: [],
			following: [],
		});

		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: userId },
			data: updateData,
		});
		expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
	});

	it('Deve atualizar o usuário sem alterar a senha quando `password` não for fornecido', async () => {
		const sut = createSut();
		const userId = 'user-123';

		const userMock = UserMock.build({ id: userId });

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.user.update.mockResolvedValue({
			...userMock,
			name: 'Novo Nome',
		});

		const result = await sut.update(userId, userId, { name: 'Novo Nome' });

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuário atualizado com sucesso !');
		expect(result.data).toEqual({
			id: userMock.id,
			name: 'Novo Nome',
			email: userMock.email,
			username: userMock.username,
			createdAt: userMock.createdAt,
			updatedAt: userMock.updatedAt,
			tweet: [],
			like: [],
			followers: [],
			following: [],
		});
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: userId },
			data: { name: 'Novo Nome' }, 
		});
	});

	it('Deve atualizar a senha do usuário corretamente', async () => {
		const sut = createSut();
		const userId = 'user-123';
		const userMock = UserMock.build({ id: userId });

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		const updateData = { password: 'nova_senha' };
		const hashedPassword = 'hashed_nova_senha';

		jest
			.spyOn(Bcrypt.prototype, 'generateHash')
			.mockResolvedValue('hashed_nova_senha');

		prismaMock.user.update.mockResolvedValue({
			...userMock,
			password: hashedPassword,
		});

		const result = await sut.update(userId, userId, updateData);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuário atualizado com sucesso !');
		expect(result.data).toBeDefined();
		expect(Bcrypt.prototype.generateHash).toHaveBeenCalledWith(
			updateData.password
		);
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			where: { id: userId },
			data: { password: hashedPassword },
		});
		expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		const result = async () =>
			await sut.update(userId, userId, { name: 'Novo Nome' });

		await expect(result).rejects.toThrow('Erro ao buscar usuário');
		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.update).not.toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao atualizar o usuário', async () => {
		const sut = createSut();
		const userId = 'user-123';
		const userMock = UserMock.build({ id: userId });

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.user.update.mockRejectedValue(
			new Error('Erro ao atualizar usuário')
		);

		const result = async () =>
			await sut.update(userId, userId, { name: 'Novo Nome' });

		await expect(result).rejects.toThrow('Erro ao atualizar usuário');
		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.update).toHaveBeenCalled();
		expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
	});
});
