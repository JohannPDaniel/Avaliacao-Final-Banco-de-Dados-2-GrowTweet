import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { FollowerMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { FollowerService } from '../../../src/services';

describe('POST /followers', () => {
	const server = createExpressServer();
	const endpoint = '/followers';
	const userMock = UserMock.build();
	const followerMock = FollowerMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando o ID do usuário quando for chamado for diferente de string e de UUID', async () => {
		const body = { userId: 123 };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
	});

	it('Deve retornar 400 quando o ID do seguidor quando for chamado for diferente de string e de UUID', async () => {
		const body = { userId: '' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-follower-id', 'invalid-id')
			.send(body);
		console.log('response:', response.body);

		expect(response.status).toBe(400);
	});

	it('Deve retornar 400 quando o ID do seguidor quando for chamado for diferente de string e de UUID', async () => {
		const body = { userId: '' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-follower-id', 'invalid-id')
			.send(body);

		expect(response.status).toBe(400);
	});

	it('Deve permitir seguir um usuário quando informado um ID de seguidor válido', async () => {
		const body = { userId: '' };
		const validId = followerMock.id;

		jest.spyOn(FollowerService.prototype, 'create').mockResolvedValue({
			success: true,
			code: 201,
			message: 'Seguidor criado com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-follower-id', `${validId}`)
			.send(body);

		expect(response.status).toBe(201);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = { userId: '' };
		const validId = followerMock.id;

		jest
			.spyOn(FollowerService.prototype, 'create')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-follower-id', `${validId}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/exceção/i);
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toContain('message');
	});
});
