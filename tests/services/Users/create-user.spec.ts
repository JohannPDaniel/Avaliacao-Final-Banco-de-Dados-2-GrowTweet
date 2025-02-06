import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CreateUserDto, UserDto } from '../../../src/dtos';
import { prismaMock } from '../../config/prisma.mock';
import { UserService } from './../../../src/services/user.service';

// Testar e-mail único
// Testar usuário cadastrado com sucesso
const userMock: User = {
	id: randomUUID(),
	name: 'any_name',
	email: 'any_email',
	username: 'any_username',
	createdAt: new Date(),
	updatedAt: new Date(),
	password: 'hashed_password',
};

describe('Create User Service', () => {
	const createSut = () => new UserService();

	it('Deve retornar email em uso, quando for fornecido um e-mail já utilizado', async () => {
		const sut = createSut();

		prismaMock.user.findFirst.mockResolvedValue(userMock)

		const dto: CreateUserDto = {
			name: 'Qualquer nome',
			email: 'email@email.com',
			username: 'nome123',
			password: 'senha123',
		};

		const result = await sut.create(dto);
		console.log('result:', result)

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(409);
		expect(result).toHaveProperty('message', 'O e-mail já está em uso !');
	});
});
