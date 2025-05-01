import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { randomUUID } from 'crypto';
import { prisma } from '../../../src/database/prisma.database';
import { TweetService } from '../../../src/services/tweet.service';

describe('DELETE /tweet', () => {
	const server = createExpressServer();
	const endpoint = '/tweets';
	const userMock = UserMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando o UUID for inválido', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.delete(`${endpoint}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/uuid/i);
	});

	it('Deve retornar 403 quando o usuário tentar atualizar um tweet que não é dele', async () => {
		const validId = randomUUID();

		jest.spyOn(prisma.tweet, 'findFirst').mockResolvedValue(null);

		const response = await supertest(server)
			.delete(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(403);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toBe(
			'Acesso negado: você não tem permissão para deletar este tweet.'
		);
	});

	it('Deve retornar 200 quando o usuário fornecer o id e a mensagem a ser atualizada', async () => {
		const validId = randomUUID();

		jest.spyOn(TweetService.prototype, 'remove').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Tweet deletado com sucesso!',
			data: {}
		});

		const response = await supertest(server)
			.delete(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/sucesso/i);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const validId = randomUUID();

		jest
			.spyOn(TweetService.prototype, 'update')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toContain('Exceção !!!');
	});
});
