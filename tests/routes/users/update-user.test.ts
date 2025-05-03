import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserService } from '../../../src/services/user.service';
import { UserMock } from '../../mock';
import { runAuthTests } from '../helpers/test-auth-helper';
import { makeToken } from '../make-token';

describe('PUT /users/:id', () => {
	const server = createExpressServer();
	const userMock = UserMock.build();
	const endpoint = '/users';
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'put', endpoint: `${endpoint}/:id` });

	it('Deve retornar 400 se o identificador do parâmetro não for um UUID', async () => {
		const response = await supertest(server)
			.put(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/uuid/i);
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('Deve retornar 400 se name se vier for diferente de um formato de string', async () => {
		const body = { name: 123 };

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toMatch(
			'O atributo nome deve vir em formato de texto !'
		);
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve retornar 400 se username se vier for diferente de um formato de string', async () => {
		const body = { name: 'Ma', username: 123 };

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(
			'O atributo username deve vir em formato de texto !'
		);
		expect(typeof response.body.message).toBe('string');
		expect(response.headers).toHaveProperty('content-type');
	});

	it('Deve retornar 400 se password se vier for diferente de um formato de string', async () => {
		const body = {
			name: 'Ma',
			username: 'mar',
			password: 123,
		};

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(
			'O atributo senha deve vir em formato de texto !'
		);
		expect(response.body).toHaveProperty('message');
		expect(response.headers['content-type']).toMatch(/json/);
	});

	it('Deve retornar 400 se os dados do name vierem com menos de 3 caracteres', async () => {
		const body = {
			name: 'Ma',
			username: 'mar',
			password: 'se',
		};

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(
			'O atributo nome deve ter pelo menos 3 caracteres !'
		);
		expect(typeof response.body.message).toBe('string');
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve retornar 400 se os dados do username vierem com menos de 5 caracteres', async () => {
		const body = {
			name: 'Maria',
			username: 'mar',
			password: 'se',
		};

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(
			'O atributo username deve ter pelo menos 5 caracteres !'
		);
		expect(typeof response.body.message).toBe('string');
		expect(response.headers['content-type']).toMatch(/json/);
	});

	it('Deve retornar 400 se os dados do password vierem com menos de 5 caracteres', async () => {
		const body = {
			name: 'Maria',
			username: 'maria123',
			password: 'se',
		};

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(
			'O atributo senha deve ter pelo menos 5 caracteres !'
		);
		expect(typeof response.body.message).toBe('string');
		expect(response.headers['content-type']).toMatch(/json/);
	});

	it('Deve retornar 200 se os dados do body e o id do usuário forem enviados corretamente', async () => {
		const body = {
			name: 'Maria',
			username: 'maria123',
			password: 'senha123',
		};

		jest.spyOn(UserService.prototype, 'update').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Usuário atualizado com sucesso !',
			data: {},
		});

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe('Usuário atualizado com sucesso !');
		expect(response.body.data).toEqual({});
		expect(response.headers['content-type']).toMatch(/json/);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(UserService.prototype, 'update')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Erro no servidor: Exceção !!!');
		expect(typeof response.body.message).toBe('string');
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});
});
