import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { UserService } from '../../../src/services/user.service';

describe('DELETE /users/:id', () => {
	const server = createExpressServer();
	const userMock = UserMock.build();
	const endpoint = '/users';
	const token = makeToken(userMock);

	it('Deve retornar 400 se o identificador do parametro não for um UUID', async () => {
		const response = await supertest(server)
			.delete(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/uuid/i);
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('Deve permitir deletar um usuário quando informado um ID correto', async () => {
		jest.spyOn(UserService.prototype, 'remove').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Usuário deletado com sucesso !',
			data: {},
		});

		const response = await supertest(server)
			.delete(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toBe('Usuário deletado com sucesso !');
		expect(response.body.data).toEqual({});
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		jest
			.spyOn(UserService.prototype, 'remove')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.delete(`${endpoint}/${userMock.id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toBe('Erro no servidor: Exceção !!!');
		expect(typeof response.body.message).toBe('string');
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});
});
