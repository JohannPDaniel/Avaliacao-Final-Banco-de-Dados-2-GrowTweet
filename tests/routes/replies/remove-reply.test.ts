import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { ReplyMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { ReplyService } from '../../../src/services';
import { runAuthTests } from '../helpers/test-auth-helper';

describe('DELETE /replies/:id', () => {
	const server = createExpressServer();
	const endpoint = '/replies';
	const userMock = UserMock.build();
	const replyMock = ReplyMock.build();
	const token = makeToken(userMock);

	runAuthTests({
		server,
		method: 'delete',
		endpoint: `${endpoint}/:id`,
	});

	it('Deve retornar 400 quando o UUID for inválido', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.delete(`${endpoint}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/uuid/i);
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve permitir deletar um reply quando informado um ID de Reply válido', async () => {
		const validId = replyMock.id;

		jest.spyOn(ReplyService.prototype, 'remove').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Reply deletado com sucesso !',
			data: {},
		});

		const response = await supertest(server)
			.delete(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/sucesso/i);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.data).toEqual({});
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const validId = replyMock.id;

		jest
			.spyOn(ReplyService.prototype, 'remove')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.delete(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message.toLowerCase()).toContain('exceção');
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});
});
