import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { LikeService } from '../../../src/services';
import { TweetMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { runAuthTests } from "../helpers/test-auth-helper";

describe('POST /likes', () => {
	const server = createExpressServer();
	const endpoint = '/likes';
	const userMock = UserMock.build();
	const tweetMock = TweetMock.build();
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'post', endpoint });

	it('Deve retornar 400 quando o ID do Tweet não estiver sido informado', async () => {
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(/tweet|id|obrigatório/);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve retornar 400 quando o ID do Usuário, se vier, não for uma string nem UUID', async () => {
		const body = { userId: 123 };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(
			'tweetid é obrigatório'
		);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve retornar 400 quando o ID do Tweet não for uma string nem UUID', async () => {
		const body = { userId: userMock.id };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', 'not-a-valid-uuid')
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/tweet|uuid|id/i);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve permitir criar um Like quando informado um ID de usuário e um ID de tweet válidos', async () => {
		const body = { userId: userMock.id };

		jest.spyOn(LikeService.prototype, 'create').mockResolvedValue({
			success: true,
			code: 201,
			message: 'Like criado com sucesso!',
			data: { id: 'like-id', tweetId: tweetMock.id, userId: userMock.id },
		});

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', `${tweetMock.id}`)
			.send(body);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/sucesso/i);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message', 'data'])
		);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = { userId: userMock.id };

		jest
			.spyOn(LikeService.prototype, 'create')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', `${tweetMock.id}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/exceção/i);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});
});
