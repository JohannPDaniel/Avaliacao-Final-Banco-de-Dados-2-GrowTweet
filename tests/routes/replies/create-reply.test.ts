import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { TweetMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { ReplyService } from '../../../src/services';

describe('POST /replies', () => {
	const server = createExpressServer();
	const endpoint = '/replies';
	const userMock = UserMock.build();
	const tweetMock = TweetMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando não for informado um conteúdo', async () => {
		const body = {};

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/conteúdo/i);
	});

	it('Deve retornar 400 quando não for informado o tipo do tweet', async () => {
		const body = { content: 'any' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch('O atributo type é obrigatório !');
	});

	it('Deve retornar 400 quando o conteúdo não for do tipo string', async () => {
		const body = { content: 123, type: 'any' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toMatch(/conteúdo/i);
	});

	it('Deve retornar 400 quando o tipo do tweet não for do tipo string', async () => {
		const body = { content: 'any', type: 123 };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toMatch(
			'O atributo type deve vir em formato de texto !'
		);
	});

	it('Deve retornar 400 quando os dados do conteúdo for menor que 5 caracteres', async () => {
		const body = { content: 'any', type: 'any' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toMatch(/conteúdo/i);
	});

	it('Deve retornar 400 quando os dados do tipo for diferente de (REPLY)', async () => {
		const body = { content: 'any_content', type: 'any' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toMatch(/reply/i);
	});

	it('Deve retornar 400 quando os dados do ID do usuário quando vier for diferente de string e não for um UUID', async () => {
		const body = {
			content: 'any_content',
			type: 'Reply',
			userId: 123,
		};

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/uuid/i);
	});

	it('Deve retornar 400 quando os dados do ID do tweet vier diferente de string ou não for um UUID', async () => {
		const body = {
			content: 'any_content',
			type: 'Reply',
		};

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/tweetid/i);
	});

	it('Deve permitir criar um Reply quando for fornecido um conteúdo, um tipo e um ID de Tweet corretos', async () => {
		const body = {
			content: 'any_content',
			type: 'Reply',
		};

		jest.spyOn(ReplyService.prototype, 'create').mockResolvedValue({
			success: true,
			code: 201,
			message: 'Reply criado com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', `${tweetMock.id}`)
			.send(body);

		expect(response.status).toBe(201);
		expect(response.body.success).toBeTruthy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/criado/i);
		expect(response.body).toHaveProperty('data');
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = {
			content: 'Este é um tweet válido',
			type: 'Reply',
		};

		jest
			.spyOn(ReplyService.prototype, 'create')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', `${tweetMock.id}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/exceção/i);
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toContain('message');
	});
});
