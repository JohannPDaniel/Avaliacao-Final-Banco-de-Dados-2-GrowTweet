import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { UserService } from '../../../src/services/user.service';

describe('PUT /users/:id', () => {
	const server = createExpressServer();
	const userMock = UserMock.build();
	const endpoint = '/users';
	const token = makeToken(userMock);

	it('Deve retornar 400 se o identificador do parametro não for um UUID', async () => {
		const response = await supertest(server)
			.put(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
	});

	it('Deve retornar 400 se name se vier for diferente de um formato de string', async () => {
		const body = { name: 123 };

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
	});

	it('Deve retornar 400 se username se vier for diferente de um formato de string', async () => {
		const body = { name: 'Ma', username: 123 };

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
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
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(UserService.prototype, 'update')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.put(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
