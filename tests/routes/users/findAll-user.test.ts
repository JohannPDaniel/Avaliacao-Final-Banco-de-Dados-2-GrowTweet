import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { UserService } from '../../../src/services/user.service';

describe('GET /users', () => {
	const server = createExpressServer();
	const endpoint = '/users';
	const userMock = UserMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando se vier um e-mail, ele não vir como uma string', async () => {
		const response = await supertest(server)
			.get(`${endpoint}?email[]=not-a-string`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/e-?mail.*texto/i);
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('Deve retornar 400 quando se vier um e-mail, ele não vir em formato de e-mail', async () => {
		const response = await supertest(server)
			.get(`${endpoint}?email=ab@ab.com`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/formato.*e-?mail/i);
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve permitir a consulta de usuários se informado um e-mail correto', async () => {
		jest.spyOn(UserService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Usuários buscado com sucesso !',
			data: {},
		});

		const response = await supertest(server)
			.get(`${endpoint}?email=maria@email.com`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toMatch(/usuários buscado com sucesso/i);
		expect(response.body).toHaveProperty('data');
		expect(response.headers['content-type']).toMatch(/json/);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(UserService.prototype, 'findAll')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(`${endpoint}?email=maria@email.com`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Erro no servidor: Exceção !!!');
		expect(typeof response.body.message).toBe('string');
		expect(response.headers['content-type']).toContain('application/json');
	});
});
