import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { ReplyMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { ReplyService } from '../../../src/services';

describe('GET /replies/:id', () => {
	const server = createExpressServer();
	const endpoint = '/replies';
	const userMock = UserMock.build();
	const replyMock = ReplyMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando o UUID for inválido', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.get(`${endpoint}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/uuid/i);
	});

	it('Deve permitir a pesquisa do Reply quando fornecido um ID válido', async () => {
		const validId = replyMock.id;

		jest.spyOn(ReplyService.prototype, 'findOneById').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Reply buscada pelo id com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.get(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const validId = replyMock.id;

		jest
			.spyOn(ReplyService.prototype, 'findOneById')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/exceção/i);
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toContain('message');
	});
});
