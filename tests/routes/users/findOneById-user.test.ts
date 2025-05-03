import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserService } from '../../../src/services/user.service';
import { UserMock } from '../../mock';
import { runAuthTests } from '../helpers/test-auth-helper';
import { makeToken } from '../make-token';

describe('GET /users/:id', () => {
	const server = createExpressServer();
	const userMock = UserMock.build();
	const endpoint = '/users';
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'get', endpoint: `${endpoint}/:id` });

	it('Deve retornar 400 se o identificador do parâmetro não for um UUID', async () => {
		const response = await supertest(server)
			.get(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/uuid/i);
		expect(response.headers['content-type']).toContain('application/json');
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
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe('Usuário buscado pelo id com sucesso!');
		expect(response.body).toHaveProperty('data');
		expect(response.headers['content-type']).toMatch(/json/);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(UserService.prototype, 'findOneById')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toBe('Erro no servidor: Exceção !!!');
		expect(response.headers['content-type']).toContain('application/json');
	});
});
