import { CreateUserDto } from '../../../src/dtos';
import { UserService } from './../../../src/services/user.service';
// Testar e-mail único
// Testar usuário cadastrado com sucesso
describe('Create User Service', () => {
	const createSut = () => new UserService();

	it('Deve retornar email em uso, quando for fornecido um e-mail já utilizado', async () => {
		const sut = createSut();

		const dto: CreateUserDto = {
			name: 'Qualquer nome',
			email: 'email@email.com',
			username: 'nome123',
			password: 'senha123',
		};

		const result = await sut.create(dto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(409);
		expect(result.data).toHaveProperty('message', 'O e-mail já está em uso !');
	});
});
