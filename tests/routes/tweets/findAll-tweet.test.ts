import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock';
import { runAuthTests } from '../helpers/test-auth-helper';
import { makeToken } from '../make-token';
import { TweetService } from '../../../src/services/tweet.service';

describe('GET /tweets - Middleware de validação de tipo (type)', () => {
	const server = createExpressServer();
	const endpoint = '/tweets';
	const userMock = UserMock.build();
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'get', endpoint });

	it('Deve retornar 400 quando o tipo do tweet não for "TWEET"', async () => {
		const query = { type: 'any_thing' };

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/tipo inválido/i);
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve retornar 400 quando "type" for "Reply"', async () => {
		const query = { type: 'Reply' };

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/tipo inválido/i);
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve permitir quando "type" não for informado', async () => {
		jest.spyOn(TweetService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Tweets buscados com sucesso!',
			data: [],
		});

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(typeof response.body.message).toBe('string');
		expect(Array.isArray(response.body.data)).toBe(true);
		expect(response.body.data.length).toBe(0);
	});

	it('Deve permitir quando "type" for "Tweet"', async () => {
		const query = { type: 'Tweet' };

		jest.spyOn(TweetService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Tweets buscados com sucesso!',
			data: [],
		});

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(typeof response.body.message).toBe('string');
		expect(Array.isArray(response.body.data)).toBe(true);
		expect(response.body.data.length).toBe(0);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const query = { type: 'Tweet' };

		jest
			.spyOn(TweetService.prototype, 'findAll')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/erro no servidor/i);
		expect(response.headers['content-type']).toContain('application/json');
	});
});
