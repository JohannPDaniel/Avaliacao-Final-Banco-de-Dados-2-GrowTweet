import { UserService } from "../../../src/services/user.service";
import { prismaMock } from '../../config/prisma.mock';
import { UserMock } from '../../mock/user.mock';

describe('UserService - remove', () => {
	const createSut = () => new UserService();

	it('Deve retornar erro 403 se o usuário tentar deletar um ID diferente do próprio', async () => {
		const sut = createSut();
		const userId = 'user-123';
		const tokenUser = 'user-456';

		const result = await sut.remove(userId, tokenUser);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para deletar este usuario.'
		);
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
		expect(prismaMock.user.delete).not.toHaveBeenCalled();
	});

	it('Deve retornar erro 404 se o usuário a ser deletado não for encontrado', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.remove(userId, userId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuario a ser deletado não encontrado !');
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.delete).not.toHaveBeenCalled();
	});

	it('Deve deletar o usuário com sucesso quando ele for encontrado', async () => {
		const sut = createSut();
		const userId = 'user-123';

		// ✅ Certifique-se de que o nome está correto no mock antes da exclusão
		const userMock = UserMock.build({
			id: userId,
			name: 'Novo Nome', // Aqui deve estar exatamente o que o teste espera
		});

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.user.delete.mockResolvedValue(userMock);

		const result = await sut.remove(userId, userId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Usuário deletado com sucesso !');

		// ✅ Agora a verificação será idêntica ao esperado
		expect(result.data).toEqual({
			id: userMock.id,
			name: userMock.name, // Agora bate com "Novo Nome"
			email: userMock.email,
			username: userMock.username,
			createdAt: userMock.createdAt,
			updatedAt: userMock.updatedAt,
			tweet: [],
			like: [],
			followers: [],
			following: [],
		});

		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
		});

		expect(prismaMock.user.delete).toHaveBeenCalledWith({
			where: { id: userId },
		});
	});

	it('Deve retornar erro 404 se o usuário a ser deletado não for encontrado', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.remove(userId, userId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuario a ser deletado não encontrado !');

		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { id: userId },
		});
		expect(prismaMock.user.delete).not.toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();
		const userId = 'user-123';

		prismaMock.user.findUnique.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		await expect(sut.remove(userId, userId)).rejects.toThrow(
			'Erro ao buscar usuário'
		);

		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.delete).not.toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao deletar o usuário', async () => {
		const sut = createSut();
		const userId = 'user-123';

		const userMock = UserMock.build({ id: userId });

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		prismaMock.user.delete.mockRejectedValue(
			new Error('Erro ao deletar usuário')
		);

		await expect(sut.remove(userId, userId)).rejects.toThrow(
			'Erro ao deletar usuário'
		);

		expect(prismaMock.user.findUnique).toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.delete).toHaveBeenCalled();
		expect(prismaMock.user.delete).toHaveBeenCalledTimes(1);
	});
});
