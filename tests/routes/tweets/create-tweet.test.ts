import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { TweetService } from '../../../src/services/tweet.service';
import { randomUUID } from 'crypto';

describe('POST /tweets', () => {
	const server = createExpressServer();
	const endpoint = '/tweets';
	const userMock = UserMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando o body estiver vazio', async () => {
		const body = {};

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toMatch(/application\/json/);
		expect(Object.keys(response.body)).toEqual(['success', 'message']);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toContain('conteúdo');
	});

	it('Deve retornar 400 quando "content" estiver ausente', async () => {
		const body = { type: 'Tweet' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(Array.isArray(Object.values(response.body))).toBe(true);
		expect(response.body.success).toBe(false);
		expect(response.body.message.startsWith('O atributo conteúdo')).toBe(true);
		expect(response.body.message.length).toBeGreaterThan(10);
	});

	it('Deve retornar 400 quando "type" estiver ausente', async () => {
		const body = { content: 'Texto válido' };
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body.message.endsWith('!')).toBe(true);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/type.*obrigatório/i);
	});

	it('Deve retornar 400 quando "content" não for string', async () => {
		const body = { content: 123, type: 'Tweet' };
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(typeof response.body.success).toBe('boolean');
		expect(response.body.message).toContain('formato de texto');
		expect(Object.hasOwn(response.body, 'message')).toBe(true);
		expect(response.body.message.split(' ').includes('conteúdo')).toBe(true);
	});

	it('Deve retornar 400 quando "type" não for string', async () => {
		const body = { content: 'Texto válido', type: 123 };
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toContain('type');
		expect(response.body.message).toMatch(/texto/i);
	});

	it('Deve retornar 400 quando "content" tiver menos de 5 caracteres', async () => {
		const body = { content: 'oi', type: 'Tweet' };
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body.message.toLowerCase()).toContain('5 caracteres');
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.includes('conteúdo')).toBe(true);
	});

	it('Deve retornar 400 quando "type" for diferente de "Tweet"', async () => {
		const body = { content: 'Texto válido', type: 'OutroTipo' };
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(/tipo.*Tweet/i);
		expect(response.body.message.includes('type')).toBe(true);
		expect(typeof response.body.message).toBe('string');
	});

	it('Deve retornar 400 quando "userId" não for uma string', async () => {
		const body = { content: 'Texto válido', type: 'Tweet', userId: 123 };
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(/uuid/i);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.length).toBeGreaterThan(10);
	});

	it('Deve retornar 400 quando "userId" for uma string inválida como UUID', async () => {
		const body = { content: 'Texto válido', type: 'Tweet', userId: 'abc123' };
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toContain('uuid');
		expect(Object.keys(response.body)).toContain('message');
	});

	it('Deve permitir o envio quando todos os dados estiverem corretos', async () => {
		const body = {
			content: 'Este é um tweet válido',
			type: 'Tweet',
			userId: userMock.id,
		};
		const mockTweet = {
			success: true,
			code: 201,
			message: 'Tweet criado com sucesso !',
			data: {
				id: randomUUID(),
				content: expect.any(String),
				type: 'Tweet',
				userId: userMock.id,
				createdAt: new Date(),
				updatedAt: new Date(),
				likeCount: expect.any(Number),
				likedByCurrentUser: expect.any(Boolean),
				like: undefined,
				reply: undefined,
			},
		};

		jest.spyOn(TweetService.prototype, 'create').mockResolvedValue(mockTweet);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect([200, 201]).toContain(response.statusCode);
		expect(response.body).not.toHaveProperty(
			'message',
			expect.stringMatching(/obrigatório|inválido/i)
		);
		expect(typeof response.body).toBe('object');
		expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1);
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = {
			content: 'Este é um tweet válido',
			type: 'Tweet',
			userId: userMock.id,
		};

		jest
			.spyOn(TweetService.prototype, 'create')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
