import { CreateUserDto, UserDto } from '../../../src/dtos';
import { prismaMock } from '../../config/prisma.mock';
import { UserService } from './../../../src/services/user.service';
import { UserMock } from '../../mock/user.mock';
import { Bcrypt } from '../../../src/utils/bcrypt';

// Testar e-mail único
// Testar usuário cadastrado com sucesso
// const userMock: User = {
// 	id: randomUUID(),
// 	name: 'any_name',
// 	email: 'any_email',
// 	username: 'any_username',
// 	password: 'hashed_password',
// 	createdAt: new Date(),
// 	updatedAt: new Date(),
// };

const mockCreateUser = (params?: Partial<CreateUserDto>) => ({
	name: params?.name || 'any_name',
	email: params?.email || 'any_email',
	username: params?.username || 'any_username',
	password: params?.password || 'any_password',
});

describe('UserService - Create', () => {
	const createSut = () => new UserService();

	it('Deve retornar email em uso, quando for fornecido um e-mail já utilizado', async () => {
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
		expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);

		expect(prismaMock.user.create).not.toHaveBeenCalled();
	});

	it('Deve retornar o usuário criado quando sucesso', async () => {
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
});
