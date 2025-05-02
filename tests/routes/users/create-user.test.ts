import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock, UserMockWithRelations } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { UserService } from '../../../src/services/user.service';
import { randomUUID } from 'crypto';

describe('POST /users', () => {
	const server = createExpressServer();
	const endpoint = '/users';
	const userMock = UserMock.build();

	it('Deve retornar 400 quando o body estiver vazio', async () => {
		const body = {};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
	});

	it('Deve retornar 400 quando o body não constar o e-mail', async () => {
		const body = { name: 'Maria' };

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo email é obrigatório !',
		});
	});

	it('Deve retornar 400 quando o body não constar o username', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo username é obrigatório !',
		});
	});

	it('Deve retornar 400 quando o body não constar o password', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
			username: 'maria123',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo password é obrigatório !',
		});
	});

	it('Deve retornar 400 quando o name for diferente de string', async () => {
		const body = {
			name: 123,
			email: 'maria@email.com',
			username: 'maria123',
			password: 'senha123',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo nome deve vir em formato de texto !',
		});
	});

	it('Deve retornar 400 quando o e-mail for diferente de string', async () => {
		const body = {
			name: 'Maria',
			email: true,
			username: 'maria123',
			password: 'senha123',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo email deve vir em formato de texto !',
		});
	});

	it('Deve retornar 400 quando o username for diferente de string', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
			username: {},
			password: 'senha123',
		};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo username deve vir em formato de texto !',
		});
	});

	it('Deve retornar 400 quando o password for diferente de string', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
			username: 'maria123',
			password: [],
		};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo senha deve vir em formato de texto !',
		});
	});

	it('Deve retornar 400 quando o name tiver menos de 3 caracteres', async () => {
		const body = {
			name: 'ab',
			email: 'maria@email.com',
			username: 'maria123',
			password: 'senha123',
		};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo nome deve ter pelo menos 3 caracteres !',
		});
	});

	it('Deve retornar 400 quando o email não tiver @ e .com', async () => {
		const body = {
			name: 'Maria',
			email: 'maria',
			username: 'maria123',
			password: 'senha123',
		};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O e-mail deve conter (@) e (.com)',
		});
	});

	it('Deve retornar 400 quando o username tiver menos de 5 caracteres', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
			username: 'abc',
			password: 'senha123',
		};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo username deve ter pelo menos 5 caracteres !',
		});
	});

	it('Deve retornar 400 quando o password tiver menos de 5 caracteres', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
			username: 'maria123',
			password: 'abc',
		};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo senha deve ter pelo menos 5 caracteres !',
		});
	});

	it('Deve criar um usuário quando fornecido um body válido', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
			username: 'maria123',
			password: 'senha123',
		};

		const mockUsers = {
			success: true,
			code: 201,
			message: 'Usuário criado com sucesso !',
			data: {
				id: userMock.id,
				name: userMock.name,
				username: userMock.username,
				createdAt: userMock.createdAt.toISOString(),
				updatedAt: userMock.updatedAt.toISOString(),
				tweet: undefined,
				reply: undefined,
				like: undefined,
				following: undefined,
				followers: undefined,
			},
		};
		jest.spyOn(UserService.prototype, 'create').mockResolvedValue(mockUsers);

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			success: true,
			message: 'Usuário criado com sucesso !',
			data: {
				id: userMock.id,
				name: userMock.name,
				username: userMock.username,
				createdAt: userMock.createdAt.toISOString(),
				updatedAt: userMock.updatedAt.toISOString(),
				tweet: undefined,
				reply: undefined,
				like: undefined,
				following: undefined,
				followers: undefined,
			},
		});
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = {
			name: 'Maria',
			email: 'maria@email.com',
			username: 'maria123',
			password: 'senha123',
		};

		jest
			.spyOn(UserService.prototype, 'create')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
