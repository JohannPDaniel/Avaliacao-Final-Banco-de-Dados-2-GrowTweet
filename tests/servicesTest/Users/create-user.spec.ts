import { prismaMock } from '../../config/prisma.mock';
import { CreateUserDto } from '../../dtos';
import { UserMock } from '../../mock/user.mock';
import { UserService } from '../../services/user.service';
import { Bcrypt } from '../../utils/bcrypt';

const mockCreateUser = (params?: Partial<CreateUserDto>) => ({
	name: params?.name || 'any_name',
	email: params?.email || 'any_email',
	username: params?.username || 'any_username',
	password: params?.password || 'any_password',
});

describe('UserService - Create', () => {
	const createSut = () => new UserService();

	it('Deve retornar erro 409 se o e-mail já estiver em uso', async () => {
		const sut = createSut();
		const dto = mockCreateUser({ email: 'any_email' });
		const userMock = UserMock.build({ email: 'any_email' });

		prismaMock.user.findFirst.mockResolvedValue(userMock);

		const result = await sut.create(dto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(409);
		expect(result).toHaveProperty('message', 'O e-mail já está em uso !');
		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where: { email: dto.email },
		});
		expect(prismaMock.user.create).not.toHaveBeenCalled();
	});

	it('Deve criar um usuário com sucesso', async () => {
		const sut = createSut();
		const dto = mockCreateUser();
		const userMock = UserMock.build();

		prismaMock.user.findFirst.mockResolvedValue(null);
		jest
			.spyOn(Bcrypt.prototype, 'generateHash')
			.mockResolvedValue('hashed_password');
		prismaMock.user.create.mockResolvedValue(userMock);

		const result = await sut.create(dto);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(201);
		expect(result.message).toBe('Usuário criado com sucesso !');
		expect(result).toHaveProperty('data');
		expect(result.data).toMatchObject({
			id: expect.any(String),
			name: userMock.name,
			email: userMock.email,
			username: userMock.username,
		});

		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where: { email: dto.email },
		});
		expect(Bcrypt.prototype.generateHash).toHaveBeenCalledWith(dto.password);
		expect(prismaMock.user.create).toHaveBeenCalled();
	});

	it('Deve lançar erro se o Prisma falhar ao verificar o e-mail', async () => {
		const sut = createSut();
		const dto = mockCreateUser();

		prismaMock.user.findFirst.mockRejectedValue(
			new Error('Erro ao buscar usuário')
		);

		await expect(sut.create(dto)).rejects.toThrow('Erro ao buscar usuário');

		expect(prismaMock.user.findFirst).toHaveBeenCalled();
		expect(prismaMock.user.create).not.toHaveBeenCalled();
		expect(typeof prismaMock.user.findFirst).toBe('function');
		expect(typeof sut.create).toBe('function');
		expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
	});

	it('Deve lançar erro se o Prisma falhar ao criar um usuário', async () => {
		const sut = createSut();
		const dto = mockCreateUser();

		prismaMock.user.findFirst.mockResolvedValue(null);
		jest
			.spyOn(Bcrypt.prototype, 'generateHash')
			.mockResolvedValue('hashed_password');
		prismaMock.user.create.mockRejectedValue(
			new Error('Erro ao criar usuário')
		);

		await expect(sut.create(dto)).rejects.toThrow('Erro ao criar usuário');

		expect(prismaMock.user.findFirst).toHaveBeenCalled();
		expect(prismaMock.user.create).toHaveBeenCalled();
		expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
		expect(Bcrypt.prototype.generateHash).toHaveBeenCalledWith(dto.password);
		expect(typeof prismaMock.user.create).toBe('function');
	});

	it('Deve garantir que a senha do usuário seja criptografada antes de salvar', async () => {
		const sut = createSut();
		const dto = mockCreateUser();
		const userMock = UserMock.build();

		prismaMock.user.findFirst.mockResolvedValue(null);
		const hashSpy = jest
			.spyOn(Bcrypt.prototype, 'generateHash')
			.mockResolvedValue('hashed_password');
		prismaMock.user.create.mockResolvedValue(userMock);

		const result = await sut.create(dto);

		expect(result.success).toBeTruthy();
		expect(hashSpy).toHaveBeenCalledWith(dto.password);
		expect(prismaMock.user.create).toHaveBeenCalledWith({
			data: {
				name: dto.name,
				email: dto.email,
				username: dto.username,
				password: 'hashed_password',
			},
		});
		expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
		expect(result.data.password).toBeUndefined();
	});
});
