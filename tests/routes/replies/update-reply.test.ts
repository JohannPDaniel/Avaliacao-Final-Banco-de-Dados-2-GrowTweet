import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { ReplyMock, UserMock } from '../../mock';
import { makeToken } from '../make-token';
import { ReplyService } from '../../../src/services';

describe('PUT /replies/:id', () => {
	const server = createExpressServer();
	const endpoint = '/replies';
	const userMock = UserMock.build();
	const replyMock = ReplyMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando o UUID for inválido', async () => {
		const invalidId = 'abc';

		const response = await supertest(server)
			.put(`${endpoint}/${invalidId}`) // Corrigido de GET para PUT
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(/uuid/);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve retornar 400 quando se houver content e ele for diferente de string', async () => {
		const body = { content: 123 };
		const validId = replyMock.id;

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(
			'o atributo conteúdo deve vir em formato de texto !'
		);
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve retornar 400 quando se houver content com menos de 5 caracteres', async () => {
		const body = { content: 'abc' };
		const validId = replyMock.id;

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message.toLowerCase()).toMatch(
			/mínimo|caracteres|pequeno/
		); // tentativa genérica
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});

	it('Deve permitir a atualização quando informado um conteúdo válido', async () => {
		const body = { content: 'Este reply é valido !' };
		const validId = replyMock.id;

		jest.spyOn(ReplyService.prototype, 'update').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Reply atualizado com sucesso !',
			data: {},
		});

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toMatch(/sucesso/i);
		expect(typeof response.body.data).toBe('object');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message', 'data'])
		);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = { content: 'Este reply é valido !' };
		const validId = replyMock.id;

		jest
			.spyOn(ReplyService.prototype, 'update')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.put(`${endpoint}/${validId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		expect(response.body.message.toLowerCase()).toContain('exceção');
		expect(typeof response.body.message).toBe('string');
		expect(Object.keys(response.body)).toEqual(
			expect.arrayContaining(['success', 'message'])
		);
	});
});
