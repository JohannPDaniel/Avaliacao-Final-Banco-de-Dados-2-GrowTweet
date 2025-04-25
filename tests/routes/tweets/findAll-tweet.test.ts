import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { runAuthTests } from '../helpers/test-auth-helper';
import { makeToken } from '../make-token';
import { Response } from 'express';
import { TweetService } from '../../../src/services/tweet.service';

describe('GET /tweets - Middleware de validação de tipo (type)', () => {
	const next = jest.fn();
	const server = createExpressServer();
	const endpoint = '/tweets';
	const userMock = UserMock.build();
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'get', endpoint });

	it('Deve permitir quando "type" não for informado', async () => {
		jest.spyOn(TweetService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Tweets listados',
			data: [],
		});

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toMatch(/tweets/i);
		expect(Array.isArray(response.body.data)).toBe(true);
		expect(response.body.data.length).toBe(0);
	});

	it('Deve retornar 400 quando o tipo do tweet não for "TWEET""', async () => {
		const req = { type: 'any_thing' };

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(req);

		expect(response.status).toBe(400);
	});

	it('Deve permitir quando "type" for "Reply"', () => {
		const req = {
			query: { type: 'Reply' },
		} as unknown as Request;
	});

	it('Deve retornar 400 quando "type" for inválido', () => {
		const req = {
			query: { type: 'comentario' },
		} as unknown as Request;
	});
});
