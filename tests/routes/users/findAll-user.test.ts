import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';

describe('GET /users', () => {
	const server = createExpressServer();
	const endpoint = '/users';
	const userMock = UserMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando se vier um e-mail, ele não vir como uma string', async () => {

		const response = await supertest(server)
			.get(`${endpoint}?email[]=not-a-string`)
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toMatch(/e-mail/i);
	});
});
