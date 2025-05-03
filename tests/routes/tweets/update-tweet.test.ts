import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { TweetService } from '../../../src/services/tweet.service';
import { TweetMock, UserMock } from '../../mock';
import { runAuthTests } from '../helpers/test-auth-helper';
import { makeToken } from '../make-token';

describe('PUT /tweets', () => {
	const server = createExpressServer();
	const endpoint = '/tweets';
	const userMock = UserMock.build();
	const tweetMock = TweetMock.build();
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'put', endpoint: `${endpoint}/:id` });

	it('Deve retornar 400 quando o UUID for inválido', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.put(`${endpoint}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/uuid/i);
	});

	it('Deve retornar 400 quando o conteúdo, se vier, vir diferente de um formato de string', async () => {
		const validId = tweetMock.id;
		const body = { content: 1 };

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.length).toBeGreaterThan(0);
	});

	it('Deve retornar 400 quando o conteúdo, se vier, vir com menos de 5 caracteres', async () => {
		const validId = tweetMock.id;
		const body = { content: 'abc' };

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.length).toBeGreaterThan(0);
	});

	it('Deve retornar 200 quando o usuário fornecer o id e a mensagem a ser atualizada', async () => {
		const validId = tweetMock.id;
		const body = { content: 'Bom dia !!!' };

		jest.spyOn(TweetService.prototype, 'update').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Tweet atualizado com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/sucesso/i);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const validId = tweetMock.id;
		const body = { content: 'Este é um tweet válido' };

		jest
			.spyOn(TweetService.prototype, 'update')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toContain('Exceção !!!');
	});
});
