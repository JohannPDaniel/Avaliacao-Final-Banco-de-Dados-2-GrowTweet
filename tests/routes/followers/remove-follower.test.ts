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

	it('Deve retornar 400 quando o ID do seguidor não for um UUID válido', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.delete(`${endpoint}/${invalidId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(/uuid|inválido|id/);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve permitir deletar um seguidor quando informado um ID correto', async () => {
		const validId = followerMock.id;

		jest.spyOn(FollowerService.prototype, 'remove').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Seguidor deletado com sucesso!',
			data: { id: validId },
		});

		const response = await supertest(server)
			.delete(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toMatch(/sucesso/i);
		expect(typeof response.body.data).toBe('object');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message', 'data'])
		);
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
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toContain('exceção');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});
});
