import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { LikeMock, TweetMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { LikeService } from '../../../src/services';

describe('DELETE /likes/:id', () => {
	const server = createExpressServer();
	const endpoint = '/likes';
	const userMock = UserMock.build();
	const likeMock = LikeMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 se o identificador do parâmetro não for um UUID', async () => {
		const response = await supertest(server)
			.delete(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/uuid/i);
		expect(response.headers['content-type']).toContain('application/json');
	});

	it('Deve permitir deletar um like quando informado um ID de Usuário válido', async () => {
		jest.spyOn(LikeService.prototype, 'remove').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Like deletado com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.delete(`${endpoint}/${likeMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		console.log('likeMock.id:', likeMock.id);
		expect(response.status).toBe(200);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(LikeService.prototype, 'remove')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.delete(`${endpoint}/${likeMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
