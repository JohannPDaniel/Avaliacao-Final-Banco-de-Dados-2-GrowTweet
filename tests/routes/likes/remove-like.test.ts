import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { LikeMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { LikeService } from '../../../src/services';
import { runAuthTests } from '../helpers/test-auth-helper';

describe('DELETE /likes/:id', () => {
	const server = createExpressServer();
	const endpoint = '/likes';
	const userMock = UserMock.build();
	const likeMock = LikeMock.build();
	const token = makeToken(userMock);

	runAuthTests({
		server,
		method: 'delete',
		endpoint: `${endpoint}/:id`,
	});

	it('Deve retornar 400 se o identificador do parâmetro não for um UUID', async () => {
		const response = await supertest(server)
			.delete(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(/uuid/);
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve permitir deletar um like quando informado um ID de Usuário válido', async () => {
		jest.spyOn(LikeService.prototype, 'remove').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Like deletado com sucesso!',
			data: { id: likeMock.id },
		});

		const response = await supertest(server)
			.delete(`${endpoint}/${likeMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/sucesso/i);
		expect(typeof response.body.data).toBe('object');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message', 'data'])
		);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(LikeService.prototype, 'remove')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.delete(`${endpoint}/${likeMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toContain('exceção');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});
});
