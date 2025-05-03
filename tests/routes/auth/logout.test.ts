import supertest from 'supertest';
import { UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { createExpressServer } from '../../../src/express.server';
import { AuthService } from '../../../src/services';
import { runAuthTests } from '../helpers/test-auth-helper';

describe('POST /logout', () => {
	const server = createExpressServer();
	const userMock = UserMock.build();
	const token = makeToken(userMock);
	const endpoint = '/logout';

	runAuthTests({ server, method: 'post', endpoint });

	it('Deve permitir fazer o logout quando informado um token autenticado', async () => {
		jest.spyOn(AuthService.prototype, 'logout').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Logout efetuado com sucesso!',
		});

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/logout efetuado com sucesso/i);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(AuthService.prototype, 'logout')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/exceção/i);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});
});
