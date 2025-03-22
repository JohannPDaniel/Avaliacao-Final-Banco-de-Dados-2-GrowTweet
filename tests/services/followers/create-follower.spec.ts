import { FollowerService } from "../../../src/services/follower.service";
import { prismaMock } from '../../config/prisma.mock';
import { FollowerMock } from '../../mock/follower.mock';
import { UserMock } from '../../mock/user.mock';

describe('FollowerService - create', () => {
	const createSut = () => new FollowerService();
	const tokenUser = 'user-123';

	it('Deve retornar erro 403 se o usuário tentar seguir em nome de outro usuário', async () => {
		const sut = createSut();
		const createFollowerDto = { userId: 'user-456', followerId: 'user-789' };

		const result = await sut.create(tokenUser, createFollowerDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(403);
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para realizar esta ação em nome de outro usuário.'
		);
		expect(result.data).toBeUndefined();
		expect(typeof createFollowerDto).toBe('object');
	});

	it('Deve retornar erro 400 se o usuário tentar seguir a si mesmo', async () => {
		const sut = createSut();
		const createFollowerDto = { userId: tokenUser, followerId: tokenUser };

		const result = await sut.create(tokenUser, createFollowerDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(400);
		expect(result.message).toBe('Você não pode seguir a si mesmo!');
		expect(result.data).toBeUndefined();
		expect(tokenUser).toEqual(createFollowerDto.userId);
	});

	it('Deve retornar erro 404 se o usuário a ser seguido não existir', async () => {
		const sut = createSut();
		const createFollowerDto = { userId: tokenUser, followerId: 'user-456' };

		prismaMock.user.findUnique
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(UserMock.build({ id: tokenUser }));

		const result = await sut.create(tokenUser, createFollowerDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário a ser seguido não encontrado!');
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(2);
		expect(typeof createFollowerDto.followerId).toBe('string');
	});

	it('Deve retornar erro 404 se o usuário seguidor não existir', async () => {
		const sut = createSut();
		const createFollowerDto = { userId: tokenUser, followerId: 'user-456' };

		prismaMock.user.findUnique
			.mockResolvedValueOnce(UserMock.build({ id: tokenUser }))
			.mockResolvedValueOnce(null);

		const result = await sut.create(tokenUser, createFollowerDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('Usuário seguidor não encontrado!');
		expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(2);
		expect(createFollowerDto.followerId).not.toBe(tokenUser);
	});

	it('Deve retornar erro 409 se o usuário já estiver seguindo o outro', async () => {
		const sut = createSut();
		const createFollowerDto = { userId: tokenUser, followerId: 'user-456' };

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: 'user-456' })
		);
		prismaMock.follower.findFirst.mockResolvedValue(
			FollowerMock.build({ id: 'follower-123' })
		);

		const result = await sut.create(tokenUser, createFollowerDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(409);
		expect(result.message).toBe('Usuário já está seguindo este usuário!');
		expect(prismaMock.follower.findFirst).toHaveBeenCalled();
		expect(result.data).toBeUndefined();
	});

	it('Deve criar um seguidor com sucesso', async () => {
		const sut = createSut();
		const createFollowerDto = { userId: tokenUser, followerId: 'user-456' };

		const followerMock = FollowerMock.build({
			userId: tokenUser,
			followerId: 'user-456',
		});

		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: tokenUser })
		);
		prismaMock.user.findUnique.mockResolvedValue(
			UserMock.build({ id: 'user-456' })
		);
		prismaMock.follower.findFirst.mockResolvedValue(null);
		prismaMock.follower.create.mockResolvedValue(followerMock);

		const result = await sut.create(tokenUser, createFollowerDto);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(201);
		expect(result.message).toBe('Seguidor criado com sucesso!');
		expect(result.data).toEqual({
			id: followerMock.id,
			userId: followerMock.userId,
			followerId: followerMock.followerId,
			createdAt: followerMock.createdAt,
		});
		expect(prismaMock.follower.create).toHaveBeenCalledWith({
			data: { userId: tokenUser, followerId: 'user-456' },
		});
	});
});
