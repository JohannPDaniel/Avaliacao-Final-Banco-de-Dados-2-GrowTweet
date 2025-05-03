import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { FollowerMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { FollowerService } from '../../../src/services';
import { runAuthTests } from '../helpers/test-auth-helper';

describe('POST /followers', () => {
	const server = createExpressServer();
	const endpoint = '/followers';
	const userMock = UserMock.build();
	const followerMock = FollowerMock.build();
	const token = makeToken(userMock);

	runAuthTests({ server, method: 'post', endpoint });

	it('Deve retornar 400 quando o ID do usuário for diferente de string e de UUID', async () => {
		const body = { userId: 123 };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(/id|uuid|usuário/);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve retornar 400 quando o ID do seguidor for inválido (não string/UUID)', async () => {
		const body = { userId: 'valid-id-format' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-follower-id', 'invalid-id')
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(/seguidor|uuid|id/);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve retornar 400 quando o ID do seguidor estiver ausente ou inválido', async () => {
		const body = { userId: '' };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-follower-id', 'invalid-id')
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/id|uuid|seguidor/i);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve permitir seguir um usuário quando informado um ID de seguidor válido', async () => {
		const body = { userId: '' };
		const validId = followerMock.id;

		jest.spyOn(FollowerService.prototype, 'create').mockResolvedValue({
			success: true,
			code: 201,
			message: 'Seguidor criado com sucesso!',
			data: { id: validId },
		});

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-follower-id', `${validId}`)
			.send(body);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/sucesso/i);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message', 'data'])
		);
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
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toContain('exceção');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});
});
