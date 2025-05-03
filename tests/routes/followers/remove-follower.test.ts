import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { FollowerMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { FollowerService } from '../../../src/services';

describe('DELETE /followers/:id', () => {
	const server = createExpressServer();
	const endpoint = '/followers';
	const userMock = UserMock.build();
	const followerMock = FollowerMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando o ID do Tweet não estiver sido informado', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.delete(`${endpoint}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
	});

	it('Deve permitir deletar um seguidor quando informado um ID correto', async () => {
		const validId = followerMock.id;

		jest.spyOn(FollowerService.prototype, 'remove').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Seguidor deletado com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.delete(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const validId = followerMock.id;

		jest
			.spyOn(FollowerService.prototype, 'remove')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.delete(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/exceção/i);
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toContain('message');
	});
});
