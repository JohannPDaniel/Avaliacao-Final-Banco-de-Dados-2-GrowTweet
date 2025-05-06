import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock';
import { runAuthTests } from '../helpers/test-auth-helper';
import { makeToken } from '../make-token';
import { FeedService } from '../../../src/services';

describe('GET /feeds', () => {
	const server = createExpressServer();
	const endpoint = '/feeds';
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

	it('Deve permitir buscar o feed quando informado um token autenticado e um tipo válido', async () => {
		const query = { type: 'Tweet' };

		jest.spyOn(FeedService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: `Feed de ${userMock.name} buscado com sucesso!`,
		});

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.query(query);

		expect(response.status).toBe(200);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const query = { type: 'Tweet' };

		jest
			.spyOn(FeedService.prototype, 'findAll')
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
