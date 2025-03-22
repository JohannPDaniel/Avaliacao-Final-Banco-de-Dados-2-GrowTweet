import { prismaMock } from '../../config/prisma.mock';
import { FollowerService } from '../../services/follower.service';

describe('FollowerService - remove', () => {
	const createSut = () => new FollowerService();
	const tokenUser = 'user-123';
	const followerId = 'follower-123';

	it('Deve retornar erro 404 se a relação de seguidor não existir ou não pertencer ao usuário', async () => {
		const sut = createSut();

		prismaMock.follower.findFirst.mockResolvedValue(null);

		const result = await sut.remove(tokenUser, followerId);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe(
			'Relação de seguidor a ser deletada não encontrada ou não pertence ao usuário autenticado!'
		);
		expect(prismaMock.follower.findFirst).toHaveBeenCalledWith({
			where: { id: followerId, userId: tokenUser },
		});
		expect(prismaMock.follower.delete).not.toHaveBeenCalled();
	});

	it('Deve deletar a relação de seguidor com sucesso', async () => {
		const sut = createSut();

		const followerMock = {
			id: followerId,
			userId: tokenUser,
			followerId: 'user-456',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.follower.findFirst.mockResolvedValue(followerMock);
		prismaMock.follower.delete.mockResolvedValue(followerMock);

		const result = await sut.remove(tokenUser, followerId);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Seguidor deletado com sucesso!');
		expect(result.data).toEqual({
			id: followerMock.id,
			userId: followerMock.userId,
			followerId: followerMock.followerId,
			createdAt: followerMock.createdAt,
		});
		expect(prismaMock.follower.delete).toHaveBeenCalledWith({
			where: { id: followerId },
		});
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar a relação de seguidor', async () => {
		const sut = createSut();

		prismaMock.follower.findFirst.mockRejectedValue(
			new Error('Erro ao buscar relação de seguidor')
		);

		await expect(sut.remove(tokenUser, followerId)).rejects.toThrow(
			'Erro ao buscar relação de seguidor'
		);
		expect(prismaMock.follower.findFirst).toHaveBeenCalled();
		expect(prismaMock.follower.delete).not.toHaveBeenCalled();
		expect(typeof followerId).toBe('string');
		expect(tokenUser).not.toBeNull();
	});

	it('Deve lançar um erro se o Prisma falhar ao deletar a relação de seguidor', async () => {
		const sut = createSut();

		const followerMock = {
			id: followerId,
			userId: tokenUser,
			followerId: 'user-456',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		prismaMock.follower.findFirst.mockResolvedValue(followerMock);
		prismaMock.follower.delete.mockRejectedValue(
			new Error('Erro ao deletar relação de seguidor')
		);

		await expect(sut.remove(tokenUser, followerId)).rejects.toThrow(
			'Erro ao deletar relação de seguidor'
		);

		expect(prismaMock.follower.delete).toHaveBeenCalledWith({
			where: { id: followerId },
		});
		expect(followerMock).toHaveProperty('id');
		expect(followerMock).toHaveProperty('userId');
		expect(followerMock.followerId).toBe('user-456');
	});
});
