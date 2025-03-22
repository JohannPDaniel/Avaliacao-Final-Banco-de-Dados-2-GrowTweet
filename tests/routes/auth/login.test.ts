import supertest from 'supertest';
import { createExpressServer } from './../../../src/express.server';
import { AuthService } from "../../../src/services/auth.service";

describe('POST /login', () => {
	const server = createExpressServer();
	const endpoint = '/login';

	it('Deve retornar 400 quando não informado um e-mail no body', async () => {
		const body = {};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo e-mail é obrigatório !',
		});
	});

	it('Deve retornar 400 quando não informado uma senha no body', async () => {
		const body = { email: 'email@email.com' };
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'O atributo senha é obrigatório !',
		});
	});

	it('Deve retornar 400 quando não informado um e-mail do tipo string', async () => {
		const body = { email: 123, password: 'senha123' };
		const response = await supertest(server).post(endpoint).send(body);

		expect(response).toHaveProperty('statusCode', 400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toBe(
			'O atributo email deve vir em formato de texto !'
		);
	});

	it('Deve retornar 400 quando não informado uma senha do tipo string', async () => {
		const body = { email: 'email@email.com', password: [] };
		const response = await supertest(server).post(endpoint).send(body);

		expect(response).toHaveProperty('statusCode', 400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toBe(
			'O atributo senha deve vir em formato de texto !'
		);
	});

	it.only('Deve retornar 200 quando fornecido um body válido', async () => {
		const body = { email: 'email@email.com', password: 'senha123' };

		// mock do service
		const mockLogin = {
			success: true,
			code: 200,
			message: 'Login efetuado com sucesso',
			data: {
				token: 'any_token',
				userId: 'any_user',
				tweetId: 'any_tweet',
				followerId: [],
			},
		};
		jest.spyOn(AuthService.prototype, 'login').mockResolvedValue(mockLogin);
		const response = await supertest(server).post(endpoint).send(body);

		console.log(response.body);

		expect(response.statusCode).toBe(200);
	});
});
