import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { UserService } from '../../../src/services/user.service';

describe('GET /users/:id', () => {
	const server = createExpressServer();
	const userMock = UserMock.build();
	const endpoint = '/users';
	const token = makeToken(userMock);

	it('Deve retornar 400 se o identificador do parametro não for um UUID', async () => {
		const response = await supertest(server)
			.get(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
	});

	it('Deve permitir a consulta por ID quando informado um ID válido', async () => {
		jest.spyOn(UserService.prototype, 'findOneById').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Usuário buscado pelo id com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.get(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(UserService.prototype, 'findOneById')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
