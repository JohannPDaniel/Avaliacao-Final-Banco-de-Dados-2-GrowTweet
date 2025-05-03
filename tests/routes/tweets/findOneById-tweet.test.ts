import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { TweetService } from '../../../src/services/tweet.service';
import { TweetMock, UserMock } from '../../mock';
import { runAuthTests } from '../helpers/test-auth-helper';
import { makeToken } from '../make-token';

describe('GET /tweets/:id', () => {
	const server = createExpressServer();
	const endpoint = '/tweets';
	const userMock = UserMock.build();
	const tweetMock = TweetMock.build();
	const token = makeToken(userMock);

	runAuthTests({
		server,
		method: 'get',
		endpoint: `${endpoint}/:id`,
	});

	it('Deve retornar 400 quando o UUID for inválido', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.get(`${endpoint}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(/uuid/i);
	});

	it('Deve retornar 200 quando o tweet for encontrado', async () => {
		const validId = tweetMock.id;

		jest.spyOn(TweetService.prototype, 'findOneById').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Tweets buscados pelo ID com sucesso!',
			data: { id: validId, content: 'teste', likeCount: 5 },
		});

		const response = await supertest(server)
			.get(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty('id', validId);
		expect(response.body.data).toHaveProperty('likeCount');
		expect(response.body.message).toMatch(/sucesso/i);
	});

	it('Deve retornar 500 quando houver erro no servidor', async () => {
		const validId = tweetMock.id;

		jest
			.spyOn(TweetService.prototype, 'findOneById')
			.mockRejectedValue(new Error('Falha interna'));

		const response = await supertest(server)
			.get(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(500);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(/erro no servidor/i);
	});
});
