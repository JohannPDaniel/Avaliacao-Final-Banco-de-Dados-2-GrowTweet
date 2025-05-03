import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { ReplyService } from '../../../src/services';
import { runAuthTests } from '../helpers/test-auth-helper';

describe('GET /replies', () => {
	const server = createExpressServer();
	const endpoint = '/replies';
	const userMock = UserMock.build();
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'get', endpoint });

	it('Deve retornar 400 quando o tipo do tweet não for "REPLY"', async () => {
		const query = { type: 'any_thing' };

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/inválido/i);
		expect(Object.keys(response.body)).toContain('message');
	});

	it('Deve retornar 400 quando "type" for "Tweet"', async () => {
		const query = { type: 'Tweet' };

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(/inválido/i);
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toContain('message');
	});

	it('Deve permitir pesquisar todos os Replies quando fornecido o tipo correto', async () => {
		const query = { type: 'Reply' };

		jest.spyOn(ReplyService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Replies buscados com sucesso !',
			data: {},
		});

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toMatch(/sucesso/i);
		expect(response.body).toHaveProperty('data');
		expect(typeof response.body.message).toBe('string');
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(ReplyService.prototype, 'findAll')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/exceção/i);
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toContain('message');
	});
});
